import db from "~/db";

export default defineEventHandler(async (event) => {

  const { name, description, begin_time, end_time, t_id: tid } = await readBody(event);

  const tournament = {
    name,
    description,
    begin_time,
    end_time,
  };

  if (event.context.user_role !== "ADMIN") {
    setResponseStatus(event, 403);
    return
  }

  if (!tournament.name) {
    setResponseStatus(event, 400);
    return {
      message: "Name is required",
    };
  }

  if (begin_time && end_time && begin_time > end_time) {
    setResponseStatus(event, 400);
    return {
      message: "Begin time must be before end time",
    };
  }

  if (!Date.parse(begin_time)) {
    tournament.begin_time = new Date();
  }

  
  let t_id
  if (tid) {
    if (!Date.parse(end_time)) {
      tournament.end_time = null;
    }
    t_id = await db
    .updateTable("Tournaments")
    .set(tournament)
    .where("t_id", "=", tid)
    .returning("t_id")
    .executeTakeFirst();
  } else {
    if (!Date.parse(end_time)) {
      delete tournament.end_time;
    }
    t_id = await db
    .insertInto("Tournaments")
    .values(tournament)
    .returning("t_id")
    .executeTakeFirst();
  }

  return {
    message: "Success",
    ...t_id,
  };
});
