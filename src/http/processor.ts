// deno-lint-ignore-file no-explicit-any

import type Context from "./context.ts";

export default class Processor {
  /**
   * Initialise the HTTP processor.
   *
   * @param context The current HTTP context.
   * @constructor
   */
  constructor(private context : Context) {}

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @returns A valid HTTP response object.
   */
  public process(body: any): Response {
    // If the middleware provides a Response object, use it.
    if (body instanceof Response) {
      return body;
    }

    const hasContentType = this.context.response.headers.get("content-type");

    // If the middleware returns an object, process it as JSON.
    if (typeof body === "object") {
      if (!hasContentType) {
        this.context.response.headers.set("content-type", "application/json");
      }

      return new Response(JSON.stringify(body), {
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

      return new Response(body as string, {
        headers: this.context.response.headers,
      });
    }

    return new Response(body as string);
  }
}
