// server/utils/db.ts

import db from '~/db'

export const getStudentUsers = async () => {
  return await db
    .selectFrom("Users")
    .select(["student_id", "firstname", "lastname"])
    .where('role', '=', 'STUDENT')
    .execute()
}

export const getAllUsers = async () => {
  return await db
    .selectFrom("Users")
    .select(["student_id", "firstname", "lastname"])
    .execute()
}

export const getCorrectSubmissions = async () => {
  return await db
    .selectFrom("Submissions")
    .leftJoin("Questions", "Submissions.question_id", "Questions.question_id")
    .leftJoin("Users", "Submissions.student_id", "Users.student_id")
    .where("Submissions.correct", "=", true)
    .where('Users.role', '=', 'STUDENT')
    .select([
      "Submissions.student_id",
      "Submissions.created_on",
      "Submissions.question_id",
      "Questions.points",
    ])
    .orderBy("Submissions.created_on", "asc")
    .execute()
}