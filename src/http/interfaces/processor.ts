// deno-lint-ignore-file no-explicit-any

import type Context from "../context.ts";
import type HttpResponse from "../response.ts";

export default interface Processor {
  process(body: any, context: Context): HttpResponse | null;
}
