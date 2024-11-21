import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Get student_id from context
  const student_id = event.context.user_id;
  if (!student_id) {
    throw createError({
      statusCode: 400,
      message: "Unauthorized",
    });
  }

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
      submission_order: true,
    },
  });

  const mappedUsers = users.map((user) => {
    const userSubmissions = submissions.filter(
      (submission) => submission.student_id === user.student_id
    );

    let totalPoints = userSubmissions.reduce(
      (acc, submission) => acc + submission.question.points,
      0
    );
    // Apply bonus points based on submission order
    const pointsWithBonus = userSubmissions.reduce((acc, submission) => {
      let bonus = 1;
      if (submission.submission_order === 1) bonus = 1.2;
      else if (submission.submission_order === 2) bonus = 1.1;
      else if (submission.submission_order === 3) bonus = 1.05;
      return acc + submission.question.points * bonus;
    }, 0);

    totalPoints = Math.floor(pointsWithBonus);
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

  // Find user's rank and data
  const userIndex = sorted.findIndex(user => user.student_id === student_id);
  if (userIndex === -1) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  return {
    message: "success",
    data: {
      rank: userIndex + 1,
      ...sorted[userIndex]
    }
  };
});
