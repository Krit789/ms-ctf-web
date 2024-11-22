import jwt from "jsonwebtoken";

export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event);
  const config = useRuntimeConfig();
  const excludePaths = ["/api/auth/login"];

  if (excludePaths.includes(event.path) || !event.path.startsWith("/api")) {
    return;
  }
  if (!headers?.authorization) {
    setResponseStatus(event, 401);
    return { message: "Unauthorized" };
  }
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
    } else {
      setResponseStatus(event, 401);
      return { message: "Unauthorized" };
    }


    if (!event.context.user_id) {
      setResponseStatus(event, 401);
      return { message: "Unauthorized" };
    }
  }
});
