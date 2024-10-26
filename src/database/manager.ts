import postgres from "npm:postgres@3.4.5";

export default class Manager {
  public query : postgres.Sql;

  constructor() {
    this.query = postgres(Deno.env.get('DATABASE_URL') as string);
  }
};
