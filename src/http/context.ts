import type { Error } from "../error/interfaces/error.ts";

/**
 * The context definition.
 */
export default class Context {
  /**
   * The current HTTP request.
   */
  public request: Request;

  /**
   * The current HTTP response.
   */
  public response: Response;

  /**
   * An error caught by the system.
   */
  public error?: Error;

  /**
   * Initialise an HTTP context.
   *
   * @constructor
   */
  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }
}
