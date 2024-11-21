import { flattenObject } from "~/lib/flatten";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  let { page, limit } = getQuery(event);

  const ilimit = Number(limit || 10);
  const ipage = Number(page || 1);

  if (isNaN(ipage) || isNaN(ilimit)) {
    setResponseStatus(event, 400);
    return { message: "Invalid page or limit parameters" };
  }

  const submissionsCount = await prisma.submissions.count();
  const totalPages = Math.ceil(submissionsCount / ilimit);

  const submissions = await prisma.submissions.findMany({
    skip: (ipage - 1) * ilimit,
    take: ilimit,
    orderBy: {
      created_on: "desc",
    },
    select: {
      question: {
        select: {
          points: true,
          question_title: true,
        },
      },
      student: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      student_id: true,
      created_on: true,
      correct: true,
    },
  });

  const flatSubmission = submissions.map((sub) => flattenObject(sub));

  return {
    data: flatSubmission,
    currentPage: ipage,
    totalPages,
    totalItems: submissionsCount,
    itemsPerPage: ilimit,
    hasNextPage: ipage < totalPages,
    hasPrevPage: ipage > 1,
  };
});
