export default defineEventHandler(async (event) => {

  const user = await prisma.users.findFirst({
    where: {
      student_id: event.context.user_id,
    },
    select: {
      student_id: true,
      firstname: true,
      lastname: true,
      role: true,
      email: true,
    }
  });

  if (!user) {
    setResponseStatus(event, 400);
    return { message: "User not found" };
  }

  return {
    message: 'Success',
    user
  }
});
