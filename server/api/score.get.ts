// server/api/score.ts

import { getStudentUsers, getCorrectSubmissions, getAllUsers } from '~/server/utils/dbquery'
import { calculatePointsForSubmission, calculateUserStats, sortUserScores } from '~/server/utils/score'
import type { UserScore, ScoreResponse, SubmissionWithPoints } from '~/types/score'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<ScoreResponse> => {
  // Get student_id from context
  let { student_id } = getQuery(event)
  student_id = Number(student_id || event.context.user_id)

  if (!student_id) {
    throw createError({
      statusCode: 400,
      message: "Unauthorized",
    })
  }

  // Fetch data in parallel
  const [users, submissions] = await Promise.all([
    event.context.u_role === 'STUDENT' ? getStudentUsers() : getAllUsers(),
    getCorrectSubmissions(),
  ])

  // Create a map of question submissions for efficient lookup
  const submissionsByQuestion = new Map<number, SubmissionWithPoints[]>()

  // Process submissions and calculate points in a single pass
  for (const submission of submissions) {
    const questionId = submission.question_id
    const questionSubmissions = submissionsByQuestion.get(questionId) || []
    
    const points = calculatePointsForSubmission(
      submission.points,
      questionSubmissions.length + 1
    )

    questionSubmissions.push({ ...submission, points })
    submissionsByQuestion.set(questionId, questionSubmissions)
  }

  // Create a map for submissions by student for efficient lookup
  const submissionsByStudent = new Map<number, SubmissionWithPoints[]>()
  
  // Flatten and group submissions by student in a single pass
  for (const questionSubmissions of submissionsByQuestion.values()) {
    for (const submission of questionSubmissions) {
      const studentSubmissions = submissionsByStudent.get(submission.student_id) || []
      studentSubmissions.push(submission)
      submissionsByStudent.set(submission.student_id, studentSubmissions)
    }
  }

  // Calculate user scores
  const userScores: UserScore[] = users.map(user => {
    const userSubmissions = submissionsByStudent.get(user.student_id) || []
    const { totalPoints, latestSubmission } = calculateUserStats(userSubmissions)

    return {
      student_id: user.student_id,
      firstname: user.firstname,
      lastname: user.lastname,
      totalPoints,
      latestSubmission,
    }
  })

  // Sort users by points and submission time
  const sortedScores = sortUserScores(userScores)

  // Find user's rank
  const userIndex = sortedScores.findIndex((user) => user.student_id === student_id)
  if (userIndex === -1) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    })
  }

  return {
    message: "success",
    data: {
      rank: userIndex + 1,
      ...sortedScores[userIndex],
    },
  }
})