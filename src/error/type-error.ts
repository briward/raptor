/**
 * An error used primarily for application code errors.
 */
export default class TypeError implements Error {
  /**
   * The name of the error.
   */
  public name: string = "Type Error";

  /**
   * The end-user message attached to the error.
   */
  public message: string = "There was a problem running the application code";

  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 500;

  /**
   * Initialise a type error.
   *
   * @constructor
   * @param message A message to override the base message.
   */
  constructor(message: string) {
    this.message = message;
  }
}
