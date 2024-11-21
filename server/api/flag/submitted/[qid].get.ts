import prisma from "~/lib/prisma";
import { flattenObject } from "~/lib/flatten";

export default defineEventHandler(async (event) => {
  const question_id = getRouterParam(event, 'qid');

  if (!question_id || !parseInt(question_id)) {
    setResponseStatus(event, 400);
    return { message: "Invalid question id" };
  }

  const question = await prisma.questions.findFirst({
    where: {
      question_id: parseInt(question_id),
    },
    select: {
      question_id: true,
      question_title: true,
      question_description: true,
    },
  });

  if (!question) {
    setResponseStatus(event, 404);
    return { message: "Question not found" };
  }

  const submissions = await prisma.submissions.findMany({
    where: {
      question_id: parseInt(question_id),
      correct: true,
    },
    select: {
      student_id: true,
      submission_id: true,
      created_on: true,
      submission_order: true,
      student: {
        select: { firstname: true, lastname: true },
      }
    },
  });
  return {
    message: "Success",
    question: question,
    submissions: submissions.map((submission) => ({
      ...flattenObject(submission), created_on: submission.created_on
    })
    ),
  }
});
