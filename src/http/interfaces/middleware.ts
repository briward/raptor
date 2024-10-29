import type Context from "../context.ts";

/**
 * The middleware definition.
 */
export interface Middleware {
  /**
   * The handler method for middleware.
   *
   * @param context The current HTTP context.
   */
  handler(context: Context): void;
}
