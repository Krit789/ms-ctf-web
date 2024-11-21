import prisma from "~/lib/prisma";


export default defineEventHandler(async (event) => {
  const users = await prisma.users.findMany({
    select: {
      student_id: true,
      firstname: true,
      lastname: true,
    },
  });

  const submissions = await prisma.submissions.findMany({
    where: {
      correct: true,
    },
    select: {
      question: {
        select: {
          points: true,
        },
      },
      student_id: true,
      created_on: true,
    },
  });

  const mappedUsers = users.map((user) => {
    const userSubmissions = submissions.filter(
      (submission) => submission.student_id === user.student_id
    );

    const totalPoints = userSubmissions.reduce(
      (acc, submission) => acc + submission.question.points,
      0
    );

    // Get the latest submission time
    const earliestSubmission =
      userSubmissions.length > 0
        ? Math.max(...userSubmissions.map((s) => s.created_on.getTime()))
        : Date.now();

    return {
      student_id: user.student_id,
      firstname: user.firstname,
      lastname: user.lastname,
      totalPoints,
      earliestSubmission,
    };
  });

  const sorted = mappedUsers.sort((a, b) =>
    b.totalPoints === a.totalPoints
      ? a.earliestSubmission - b.earliestSubmission
      : b.totalPoints - a.totalPoints
  );

  return {
    message: "success",
    mappedUsers: sorted.map((user) => {
      return {
        student_id: user.student_id,
        firstname: user.firstname,
        lastname: user.lastname,
        totalPoints: user.totalPoints,
      };
    }),
  };
});
