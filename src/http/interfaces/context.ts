import type HttpRequest from "../request.ts";
import type HttpResponse from "../response.ts";

/**
 * The request parameters definition.
 */
export interface Params {
  /**
   * The param key value pair.
   */
  [key: string]: string;
}

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

  /**
   * The current route parameters.
   */
  params: Params;
}
