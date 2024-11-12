// deno-lint-ignore-file no-explicit-any

import type Context from "./context.ts";
import HttpResponse from "./response.ts";

export default class Processor {
  /**
   * Initialise the HTTP processor.
   *
   * @param context The current HTTP context.
   * @constructor
   */
  constructor(private context: Context) {}

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @param status A valid HTTP status code.
   * @returns A valid HTTP response object.
   */
  public process(body: any): HttpResponse {
    // Check if the response already has a content type set.
    const hasContentType = this.context.response.headers.get("content-type");

    // If the middleware returns an object, process it as JSON.
    if (typeof body === "object") {
      if (!hasContentType) {
        this.context.response.headers.set("content-type", "application/json");
      }

      return new HttpResponse(JSON.stringify(body), {
        status: this.context.response.status,
        headers: this.context.response.headers,
      });
    }

    // If the middleware returns a string, process plain text or HTML.
    if (typeof body === "string") {
      const isHtml = (new RegExp(/<[a-z/][\s\S]*>/i)).test(body);

      if (!hasContentType) {
        this.context.response.headers.set("content-type", "text/plain");
      }

      if (isHtml && !hasContentType) {
        this.context.response.headers.set("content-type", "text/html");
      }

      return new HttpResponse(body as string, {
        status: this.context.response.status,
        headers: this.context.response.headers,
      });
    }

    return new HttpResponse(body as string, {
      status: this.context.response.status,
      headers: this.context.response.headers,
    });
  }
}
