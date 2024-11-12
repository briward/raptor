// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import HttpResponse from "../response.ts";
import type Processor from "../interfaces/processor.ts";

export default class JsonProcessor implements Processor {
  public process(body: any, context: Context): HttpResponse | null {
    // Check if the response already has a content type set.
    const hasContentType = context.response.headers.get("content-type");

    // If the middleware returns an object, process it as JSON.
    if (typeof body === "object") {
      if (!hasContentType) {
        context.response.headers.set("content-type", "application/json");
      }

      return new HttpResponse(JSON.stringify(body), {
        status: context.response.status,
        headers: context.response.headers,
      });
    }

    return null;
  }
}
