// server/api/profile.ts

import db from "~/db";
import { calculatePointsForSubmission } from '~/server/utils/score'
import type { H3Event } from 'h3'

interface ProfileSubmission {
  question_id: number
  question_title: string | null
  question_description: string | null
  base_points: number | null
  points_with_bonus: number
  created_on: Date
  submission_order: number
}

export interface ProfileResponse {
  message: string
  user: {
    student_id: string
    firstname: string
    lastname: string
  }
  submissions: ProfileSubmission[]
}

export default defineEventHandler(async (event: H3Event): Promise<ProfileResponse> => {
  const student_id = getRouterParam(event, 'userid')
  const { tid: tournament_id } = getQuery(event);
  const tid = tournament_id ? Number(tournament_id) : null;


  if (!student_id) {
    throw createError({
      statusCode: 400,
      message: "Invalid student id"
    })
  }

  const [user, allSubmissions] = await Promise.all([
    db.selectFrom('Users')
      .select(["student_id", "firstname", "lastname"])
      .$if(event.context.u_role === 'STUDENT', (qb) => qb.where('role', '=', 'STUDENT'))
      .where("student_id", "=", student_id)
      .executeTakeFirst(),
    db.selectFrom("Submissions")
      .leftJoin("Questions", "Submissions.question_id", "Questions.question_id")
      .select([
        "Submissions.question_id",
        "Submissions.student_id",
        "Submissions.created_on",
        "question_title",
        "question_description",
        "Questions.points as base_points",
      ])
      .$if(tid !== null, (qb) => qb.where("Questions.tournament_id", "=", tid))
      .where("correct", "=", true)
      .orderBy("Submissions.created_on", "asc")
      .execute()
  ])

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found"
      })
    }
  // Group submissions by question to calculate order
  const submissionsByQuestion = new Map<number, typeof allSubmissions>()
  
  for (const submission of allSubmissions) {
    const questionId = submission.question_id
    if (!submissionsByQuestion.has(questionId)) {
      submissionsByQuestion.set(questionId, [])
    }
    submissionsByQuestion.get(questionId)!.push(submission)
  }

  // Process user's submissions with order and bonus points
  const userSubmissions: ProfileSubmission[] = []

  for (const [, submissions] of submissionsByQuestion) {
    const userSubmission = submissions.find(s => s.student_id === student_id)
    if (userSubmission) {
      const submissionOrder = submissions.findIndex(s => s.student_id === student_id) + 1
      const pointsWithBonus = calculatePointsForSubmission(userSubmission.base_points, submissionOrder)

      userSubmissions.push({
        question_id: userSubmission.question_id,
        question_title: userSubmission.question_title,
        question_description: userSubmission.question_description,
        base_points: userSubmission.base_points,
        points_with_bonus: pointsWithBonus,
        created_on: userSubmission.created_on,
        submission_order: submissionOrder
      })
    }
  }

  // Sort by newest first
  const sortedSubmissions = userSubmissions.sort(
    (a, b) => b.created_on.getTime() - a.created_on.getTime()
  )

  return {
    message: "Success",
    user,
    submissions: sortedSubmissions
  }
})