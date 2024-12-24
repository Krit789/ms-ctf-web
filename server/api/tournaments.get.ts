import db from "~/db";

export default defineEventHandler(async (event) => {
  const { tid: tournament_id } = getQuery(event);

  const tid = tournament_id ? Number(tournament_id) : null;

  if (tid) {
    const [tournament] = await Promise.all([
      db
        .selectFrom("Tournaments")
        .select([
          "Tournaments.name",
          "Tournaments.t_id",
          "Tournaments.description",
          "Tournaments.begin_time",
          "Tournaments.end_time",
        ])
        .where("t_id", "=", tid)
        .executeTakeFirst(),
    ]);
    if (!tournament) {
      setResponseStatus(event, 404);
      return {
        message: "Tournament not found",
      };
    }
    return {
      message: "Success",
      tournament,
    };
  } else if (tournament_id === "*") {
    const [tournament] = await Promise.all([
      db
        .selectFrom("Tournaments")
        .select([
          "Tournaments.name",
          "Tournaments.t_id",
          "Tournaments.begin_time",
          "Tournaments.end_time",
        ])
        .execute(),
    ]);
    return {
      message: "Success",
      tournament,
    };
  } else {
    setResponseStatus(event, 400);
    return {
      message: "Invalid tournament id",
    };
  }
});
