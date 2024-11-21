import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event);
  const config = useRuntimeConfig();
  const excludePaths = ["/api/auth/login"];
  if (
    headers !== null &&
    headers.authorization &&
    !excludePaths.includes(event.path)
  ) {
    const token = headers.authorization.split(" ")[1] || null;
    if (token) {
      let verification = null;
      try {
        verification = jwt.verify(token, config.jwt_secret) as jwt.JwtPayload;
      } catch (error) {
        verification = null;
      }
      if (verification) {
        event.context.user_id = verification.u_id;
        event.context.user_role = verification.u_role;
      }
    }

    if (!event.context.user_id) {
      setResponseStatus(event, 401);
      return { message: "Unauthorized" };
    }
  }
});
