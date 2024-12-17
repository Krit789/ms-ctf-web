import db from "~/db";

export default defineEventHandler(async (event) => {
  // const user = await prisma.users.findFirst({
  //   where: {
  //     student_id: event.context.user_id,
  //   },
  //   select: {
  //     student_id: true,
  //     firstname: true,
  //     lastname: true,
  //     role: true,
  //     email: true,
  //   }
  // });

  const user = await db
    .selectFrom("Users")
    .select(["student_id", "firstname", "lastname", "role", "email"])
    .where("student_id", "=", event.context.user_id)
    .executeTakeFirst();

  if (!user) {
    setResponseStatus(event, 400);
    return { message: "User not found" };
  }

  return {
    message: "Success",
    user,
  };
});
