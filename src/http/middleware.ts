import type Context from "./context.ts";

import type { Middleware as Interface } from "./interfaces/middleware.ts";

export default abstract class Middleware implements Interface {
  public handler(_context: Context): void {
    //
  }
}
