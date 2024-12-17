import { sql } from "kysely";
import db from "~/db";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { flag, question_id }: { flag: string; question_id: number } =
    await readBody(event);

  if (!event.context.user_id) {
    setResponseStatus(event, 401);
    return { message: "Unauthorized" };
  }

  if (!flag || !question_id || isNaN(question_id)) {
    setResponseStatus(event, 400);
    return { message: "Flag and question_id are required" };
  }

  const question = await db
    .selectFrom("Questions")
    .select(["question_id", "global_answer"])
    .where("question_id", "=", question_id)
    .executeTakeFirst();

  if (!question) {
    setResponseStatus(event, 400);
    return { message: "Question not found" };
  }

  const checkSubmission = await db
    .selectFrom("Submissions")
    .where("correct", "=", true)
    .where("student_id", "=", event.context.user_id)
    .where("question_id", "=", question_id)
    .executeTakeFirst();

  if (checkSubmission) {
    setResponseStatus(event, 400);
    return { message: "You've already submitted the answer" };
  }

  const anwser = await db
    .selectFrom("Answers")
    .select(["answer"])
    .where("question_id", "=", question_id)
    .$if(!question.global_answer, (qb) =>
      qb.where("for_student_id", "=", event.context.user_id)
    )
    .executeTakeFirst();

  if (!anwser) {
    setResponseStatus(event, 400);
    return { message: "Answer not found" };
  }

  const isCorrect = anwser.answer === flag;
  let correct_submission_count = 0;


  await db
    .insertInto("Submissions")
    .values({
      student_id: event.context.user_id,
      flag: flag,
      correct: isCorrect,
      question_id: question_id
    })
    .execute();

  const result = await db
    .selectFrom("Submissions")
    .leftJoin("Users", "Submissions.student_id", "Users.student_id")
    .where("Users.role", "=", "STUDENT")
    .where("correct", "=", true)
    .where("question_id", "=", question_id)
    .select(sql<number>`count(*)`.as("total"))
    .executeTakeFirst()
    .then((res) => res || { total: 0 });

  correct_submission_count = result.total;

  if (isCorrect) {
    setResponseStatus(event, 200);
    let blood_message = "";
    if (correct_submission_count === 1) {
      blood_message = " as first blood!";
    } else if (correct_submission_count === 2) {
      blood_message = " as second blood!";
    } else if (correct_submission_count === 3) {
      blood_message = " as third blood!";
    } else if (correct_submission_count === 4) {
      blood_message = " as forth blood!";
    } else if (correct_submission_count === 5) {
      blood_message = " as fifth blood!";
    }

    return {
      message: `Congratulation! You've answered correctly${blood_message}`,
      correct: true,
      submission_order: correct_submission_count,
    };
  } else {
    setResponseStatus(event, 200);
    return { message: "Sorry! That's not the right answer!", correct: false };
  }
});
