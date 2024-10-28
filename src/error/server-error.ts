/**
 * An error used primarily in 500 internal server errors.
 */
export default class ServerError implements Error {
  /**
   * The name of the error.
   */
  public name: string = "Server Error";

  /**
   * The end-user message attached to the error.
   */
  public message: string = "There was a server error handling the request";

  /**
   * The HTTP status code associated with the error.
   */
  public status: number = 500;
}
