import type Context from "./context.ts";

import type { Middleware as Interface } from "./interfaces/middleware.ts";

/**
 * HTTP middleware can be used to hook in and utilise the HTTP request
 * and response objects.
 */
export default abstract class Middleware implements Interface {
  /**
   * The root handler for the middleware.
   *
   * @param _context The HTTP context provided to the middleware.
   */
  public handler(_context: Context): void {
    //
  }
}
