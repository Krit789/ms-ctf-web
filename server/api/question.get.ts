import prisma from "~/lib/prisma";

const config = useRuntimeConfig();

interface Question {
  question_id: number;
  question_title: string;
  question_description: string;
  points: number;
  created_on: Date;
}

interface Submission {
  question_id: number;
  correct: boolean;
  created_on: Date;
  submission_order: number;
}

interface QuestionWithSubmission extends Question {
  submission: {
    correct: boolean;
    created_on: Date;
    submission_order: number;
  } | null;
}

function mapSubmissionsToQuestions(
  questions: Question[],
  submissions: Submission[] | undefined
): QuestionWithSubmission[] {
  if (!submissions || submissions.length === 0) {
    return questions.map((q) => ({ ...q, submission: {
      correct: false,
      created_on: new Date(),
      submission_order: -1,
    } }));
  }

  const submissionMap: Record<number, Submission> = {};
  submissions.forEach((sub) => {
    submissionMap[sub.question_id] = sub;
  });

  return questions.map((q) => ({
    ...q,
    submission: submissionMap[q.question_id]
      ? {
          correct: submissionMap[q.question_id].correct,
          created_on: submissionMap[q.question_id].created_on,
          submission_order: submissionMap[q.question_id].submission_order,
        }
      : {
        correct: false,
        created_on: new Date(),
        submission_order: -1,
      },
  }));
}

export default defineEventHandler(async (event) => {
  let question, submission;
  question = await prisma.questions.findMany({
    select: {
      question_id: true,
      question_title: true,
      question_description: true,
      points: true,
      created_on: true,
    },
  });

  if (!question) {
    setResponseStatus(event, 200);
    return { message: "No question not found", question: [] };
  }

  if (event.context.role !== "ADMIN") {
    submission = await prisma.submissions.findMany({
      select: {
        question_id: true,
        correct: true,
        created_on: true,
        submission_order: true,
      },
    });
  }

  const questionWithSubmission = mapSubmissionsToQuestions(
    question,
    submission
  );

  return {
    message: "Success",
    questionWithSubmission,
  };
});
