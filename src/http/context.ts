import type HttpRequest from "./request.ts";
import type HttpResponse from "./response.ts";

/**
 * The context definition.
 */
export default class Context implements Context {
  /**
   * The current HTTP request.
   */
  public request: HttpRequest;

  /**
   * The current HTTP response.
   */
  public response: HttpResponse;

  /**
   * Initialise an HTTP context.
   *
   * @constructor
   * @param request The current HTTP request.
   * @param response The current HTTP response.
   */
  constructor(request: HttpRequest, response: HttpResponse) {
    this.request = request;
    this.response = response;
  }
}
