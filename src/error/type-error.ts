export default class TypeError implements Error {
  public name: string = "Type Error";
  public message: string = "There was a problem running the application code";
  public status: number = 500;

  constructor(message: string) {
    this.message = message;
  }
}
