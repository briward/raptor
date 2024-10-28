/**
 * An error used primarily in validation request errors.
 */
export default class BadRequest implements Error {
  /**
   * The name of the error.
   */
  public name: string = "Bad Request";

  /**
   * The end-user message attached to the error.
   */
  public message: string = "There was an issue handling your request";

  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 400;

  /**
   * Any error messages associated with the error.
   */
  public errors: string[];

  /**
   * Initialise a bad request error.
   *
   * @constructor
   * @param errors Any error messages associated with the error.
   */
  constructor(errors: string[]) {
    this.errors = errors;
  }
}
