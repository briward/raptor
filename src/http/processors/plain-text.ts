// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import HttpResponse from "../response.ts";
import type Processor from "../interfaces/processor.ts";

export default class PlainTextProcessor implements Processor {
  public process(body: any, context: Context): HttpResponse | null {
    // If the middleware returns a string, process plain text.
    if (typeof body === "string") {
      const isHtml = (new RegExp(/<[a-z/][\s\S]*>/i)).test(body);

      if (!isHtml) {
        context.response.headers.set("content-type", "text/plain");
      }

      return new HttpResponse(body as string, {
        status: context.response.status,
        headers: context.response.headers,
      });
    }

    return null;
  }
}
