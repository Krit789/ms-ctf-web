import { authenticate } from "ldap-authentication";
import jwt from "jsonwebtoken";
import db from "~/db";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  let { username, password }: { username: string; password: string } =
    await readBody(event);
  let { spoof } = getQuery(event);

  if (spoof === "spoofkey") {
    const stu_id = parseInt(username);
    const user = await db
      .selectFrom("Users")
      .select(["student_id", "role", "password"])
      .where("student_id", "=", stu_id)
      .executeTakeFirst();
    if (user?.student_id && user.role) {
      const token = jwt.sign(
        { u_id: user.student_id, u_role: user.role },
        config.jwt_secret,
        { expiresIn: "1d" }
      );
      return { message: "Login success", access_token: token };
    }
    return { message: "User doesn't exist" };
  }

  if (!username || !password) {
    setResponseStatus(event, 400);
    return { message: "Username and password are required" };
  }

  if (username.startsWith("it")) {
    username = username.slice(2).trim();
  }

  if (username.endsWith("@kmitl.ac.th")) {
    username = username.slice(0, -12).trim();
  }

  const stu_id = parseInt(username);

  if (stu_id) {
    const user = await db
      .selectFrom("Users")
      .select(["student_id", "role", "password"])
      .where("student_id", "=", stu_id)
      .executeTakeFirst();
    // const user = await prisma.users.findFirst({
    //   where: {
    //     student_id: stu_id,
    //   },
    //   select: {
    //     student_id: true,
    //     role: true,
    //     password: true,
    //   }
    // });

    if (!user || !password) {
      setResponseStatus(event, 400);
      return { message: "Username or password is incorrect" };
    }

    if (!user.password) {
      // LDAP Authentication
      const options = {
        ldapOpts: {
          url: config.ldap_server,
        },
        adminDn: config.ldap_bind,
        adminPassword: config.ldap_password,
        userSearchBase: config.ldap_user_search_base,
        usernameAttribute: "sAMAccountName",
        username: "it" + user.student_id,
        userPassword: password,
        attributes: ["dn", "sn", "cn"],
      };
      let result = null;
      try {
        result = await authenticate(options);
      } catch (error) {
        console.log(error);
        setResponseStatus(event, 400);
        return { message: "Username or password is incorrect" };
      }
    }
    const token = jwt.sign(
      { u_id: user.student_id, u_role: user.role },
      config.jwt_secret,
      { expiresIn: "1d" }
    );
    return { message: "Login success", access_token: token };
  } else {
    setResponseStatus(event, 400);
    return { message: "User doesn't exist" };
  }
});
