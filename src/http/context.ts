import type HttpRequest from "./request.ts";
import type HttpResponse from "./response.ts";
import type { Params } from "./interfaces/context.ts";

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
   * The processed route parameters.
   */
  public params: Params;

  /**
   * Initialise an HTTP context.
   *
   * @constructor
   * @param request The current HTTP request.
   * @param response The current HTTP response.
   * @param params The processed route parameters.
   */
  constructor(request: HttpRequest, response: HttpResponse, params?: Params) {
    this.request = request;
    this.response = response;
    this.params = params || {};
  }
}
