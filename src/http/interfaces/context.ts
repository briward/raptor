import type HttpRequest from "../request.ts";
import type HttpResponse from "../response.ts";

/**
 * The HTTP context definition.
 */
export interface Context {
  /**
   * The current HTTP request.
   */
  request: HttpRequest;

  /**
   * The current HTTP response.
   */
  response: HttpResponse;
}
