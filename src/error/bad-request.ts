export default class BadRequest implements Error {
  public name: string = "Bad Request";
  public message: string = "There was an issue handling your request";
  public status: number = 400;
  public errors: string[];

  constructor(errors: string[]) {
    this.errors = errors;
  }
}
