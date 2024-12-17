// server/api/leaderboard.ts

import { getStudentUsers, getCorrectSubmissions } from '~/server/utils/dbquery'
import { calculatePointsForSubmission, sortUserScores, calculateUserStats } from '~/server/utils/score'
import type { UserScore, LeaderboardResponse, SubmissionWithPoints } from '~/types/score'

export default defineEventHandler(async (event): Promise<LeaderboardResponse> => {
  // Fetch data in parallel
  const [users, submissions] = await Promise.all([
    getStudentUsers(),
    getCorrectSubmissions(),
  ])

  // Create a map of question submissions for efficient lookup
  const submissionsByQuestion = new Map<number, SubmissionWithPoints[]>()

  // Process submissions and calculate points
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

  // Group submissions by student
  const submissionsByStudent = new Map<number, SubmissionWithPoints[]>()
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

  const sortedScores = sortUserScores(userScores)

  return {
    message: "success",
    rankings: sortedScores.map(({ student_id, firstname, lastname, totalPoints }) => ({
      student_id,
      firstname,
      lastname,
      totalPoints,
    })),
  }
})