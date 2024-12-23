import { flattenObject } from "~/lib/flatten";
import db from "~/db";
import { sql } from "kysely";

export default defineEventHandler(async (event) => {
  let { page, limit, tid } = getQuery(event);

  tid = tid ? Number(tid) : null;

  const ilimit = Number(limit || 10);
  const ipage = Number(page || 1);

  if (isNaN(ipage) || isNaN(ilimit)) {
    setResponseStatus(event, 400);
    return { message: "Invalid page or limit parameters" };
  }

  const [{ total }, submissions] = await Promise.all([
    db
      .selectFrom("Submissions")
      .leftJoin("Users", "Submissions.student_id", "Users.student_id")
      .leftJoin("Questions", "Submissions.question_id", "Questions.question_id")
      .$if(tid !== null, (qb) => qb.where("Questions.tournament_id", "=", tid))
      .$if(event.context.u_role === 'STUDENT', (qb) => qb.where('Users.role', '=', 'STUDENT'))
      .where('Users.role', '=', 'STUDENT')
      .select(sql<number>`count(*)`.as("total"))
      .executeTakeFirst()
      .then((res) => res || { total: 0 }),
      db
      .selectFrom("Submissions")
      .leftJoin("Questions", "Submissions.question_id", "Questions.question_id")
      .leftJoin("Users", "Submissions.student_id", "Users.student_id")
      .$if(tid !== null, (qb) => qb.where("Questions.tournament_id", "=", tid))
      .where('Users.role', '=', 'STUDENT')
      .$if(event.context.u_role === 'STUDENT', (qb) => qb.where('Users.role', '=', 'STUDENT'))
      .select([
        "Questions.points",
        "Questions.question_id",
        "Questions.question_title",
        "Users.firstname",
        "Users.lastname",
        "Submissions.student_id",
        "Submissions.created_on",
        "Submissions.correct",
      ])
      .orderBy("Submissions.created_on", "desc")
      .limit(ilimit)
      .offset((ipage - 1) * ilimit)
      .execute(),
  ]);

  const totalPages = Math.ceil(total / ilimit);

  return {
    data: submissions,
    currentPage: ipage,
    totalPages,
    totalItems: total,
    itemsPerPage: ilimit,
    hasNextPage: ipage < totalPages,
    hasPrevPage: ipage > 1,
  };
});
