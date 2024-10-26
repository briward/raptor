import postgres from "@postgres";

export default class Manager {
  public query : postgres.Sql;

  constructor() {
    this.query = postgres(Deno.env.get('DATABASE_URL') as string);
  }
};
