/**
 * An error used primarily in 404 not found request errors.
 */
export default class NotFound implements Error {
  /**
   * The name of the error.
   */
  public name: string = "Not Found";

  /**
   * The end-user message attached to the error.
   */
  public message: string = "The resource requested could not be found";

  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 404;
}
