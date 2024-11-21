import prisma from "~/lib/prisma";


export default defineEventHandler(async (event) => {
  const student_id = getRouterParam(event, 'userid');

  if (!student_id || !parseInt(student_id)) {
    setResponseStatus(event, 400);
    return { message: "Invalid student id" };
  }

  const users = await prisma.users.findFirst({
    where: {
      student_id: parseInt(student_id),
    },
    select: {
      student_id: true,
      firstname: true,
      lastname: true,
    },
  });

  if (!users) {
    setResponseStatus(event, 404);
    return { message: "User not found" };
  }

  const submissions = await prisma.submissions.findMany({
    where: {
      student_id: parseInt(student_id),
      correct: true,
    },
    select: {
      question: {
        select: {
          question_title: true,
          question_description: true,
          points: true,
          created_on: true,
        },
      },
    },
  });
  return {
    message: "Success",
    user: users,
    submissions,
  }
});
