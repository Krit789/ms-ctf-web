// server/api/profile/all.get.ts

import db from "~/db";
import { calculatePointsForSubmission } from '~/server/utils/score'
import type { H3Event } from 'h3'

interface ProfileSubmission {
  user_id: string
  question_id: number
  question_title: string | null
  base_points: number | null
  points_with_bonus: number
  created_on: Date
  submission_order: number
}
export interface ProfilesResponse {
  message: string
  submissions: ProfileSubmission[]
}

export default defineEventHandler(async (event: H3Event): Promise<ProfilesResponse> => {
  const [users, allSubmissions] = await Promise.all([
    db.selectFrom('Users')
      .select(["student_id", "firstname", "lastname"])
      // .$if(event.context.u_role === 'STUDENT', (qb) => qb.where('role', '=', 'STUDENT'))
      .where('role', '=', 'STUDENT')
      .execute(),
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
      .where("correct", "=", true)
      .orderBy("Submissions.created_on", "asc")
      .execute()
  ])

  // Group submissions by question to calculate order
  const submissionsByQuestion = new Map<number, typeof allSubmissions>()
  
  for (const submission of allSubmissions) {
    const questionId = submission.question_id
    if (!submissionsByQuestion.has(questionId)) {
      submissionsByQuestion.set(questionId, [])
    }
    submissionsByQuestion.get(questionId)!.push(submission)
  }

  // Process submissions for all users
  const allUserSubmissions: ProfileSubmission[] = []
  
  users.forEach(user => {
    const userSubmissions: ProfileSubmission[] = []

    for (const [, submissions] of submissionsByQuestion) {
      const userSubmission = submissions.find(s => s.student_id === user.student_id)
      if (userSubmission) {
        const submissionOrder = submissions.findIndex(s => s.student_id === user.student_id) + 1
        const pointsWithBonus = calculatePointsForSubmission(userSubmission.base_points, submissionOrder)

        userSubmissions.push({
          user_id: user.student_id,
          question_id: userSubmission.question_id,
          question_title: userSubmission.question_title,
          base_points: userSubmission.base_points,
          points_with_bonus: pointsWithBonus,
          created_on: userSubmission.created_on,
          submission_order: submissionOrder
        })
      }
    }

    // Sort submissions by newest first
    const sortedSubmissions = userSubmissions.sort(
      (a, b) => b.created_on.getTime() - a.created_on.getTime()
    )

    allUserSubmissions.push(...sortedSubmissions)
  })

  return {
    message: "Success",
    submissions: allUserSubmissions
  }
})
