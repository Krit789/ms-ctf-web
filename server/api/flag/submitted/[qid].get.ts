import db from "~/db";

export default defineEventHandler(async (event) => {
  const question_id = getRouterParam(event, "qid");

  let { tid } = getQuery(event);
  tid = tid ? Number(tid) : null;

  if (!question_id || !parseInt(question_id)) {
    setResponseStatus(event, 400);
    return { message: "Invalid question id" };
  }

  const [question, submissions] = await Promise.all([
    db
      .selectFrom("Questions")
      .select(["question_id", "question_title", "question_description"])
      .where("question_id", "=", parseInt(question_id))
      .$if(tid !== null, (query) => query.where("Questions.tournament_id", "=", tid))
      .executeTakeFirst(),
    db
      .selectFrom("Submissions")
      .leftJoin("Users", "Submissions.student_id", "Users.student_id")
      .leftJoin("Questions", "Submissions.question_id", "Questions.question_id")
      .select([
        "Submissions.student_id",
        "submission_id",
        "Submissions.created_on",
        "firstname",
        "lastname",
      ])
      .orderBy("Submissions.created_on asc")
      .where("Submissions.correct", "=", true)
      .where("Submissions.question_id", "=", parseInt(question_id))
      .$if(tid !== null, (query) => query.where("Questions.tournament_id", "=", tid))
      .execute(),
  ])

    if (!question) {
      setResponseStatus(event, 404);
      return { message: "Question not found" };
    }

  return {
    message: "Success",
    question,
    submissions,
  };
});
