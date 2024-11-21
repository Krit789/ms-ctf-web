import prisma from "~/lib/prisma";

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

  const question_answer = await prisma.questions.findFirst({
    where: {
      AND: [
        { question_id: Number(question_id) },
        {
          Answers: {
            some: {
              for_student_id: event.context.user_id
            }
          }
        }
      ]
    },
    include: {
      Answers: {
        where: {
          for_student_id: event.context.user_id
        },
        select: {
          answer_id: true,
          for_student_id: true,
          answer: true,
        }
      },
    }
  });

  if (!question_answer) {
    setResponseStatus(event, 400);
    return { message: "Question not found" };
  }

  const checkSubmission = await prisma.submissions.findFirst({
    where: {
      AND: [
        { student_id: event.context.user_id },
        { question_id: Number(question_id) },
        { correct: true }
      ]
    }
  });

  if (checkSubmission) {
    setResponseStatus(event, 400);
    return { message: "You've already submitted the answer" };
  }

  const isCorrect = question_answer.Answers[0].answer === flag;
  let correct_submission_count = -1;
  prisma.$transaction(async (tx) => {
    const correct_submission_count = await tx.submissions.count({
      where: {
        correct: true,
      }
    })
    await tx.submissions.create({
      data: {
        student_id: event.context.user_id,
        flag: flag,
        correct: isCorrect,
        question_id: question_id,
        submission_order: isCorrect ? correct_submission_count + 1 : -1,
      }
    })
  });

  correct_submission_count = await prisma.submissions.count({
    where: {
      correct: true,
    }
  })

  if (isCorrect) {
    setResponseStatus(event, 200);
    return { message: `Congratulation! You've answered correctly${(correct_submission_count === 1) ? " as first blood!" : ""}`, correct: true, submission_order: correct_submission_count  };
  } else {
    setResponseStatus(event, 200);
    return { message: "Sorry! That's not the right answer!", correct: false };
  }

});
