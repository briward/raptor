import Context from "./http/context.ts";
import HttpRequest from "./http/request.ts";
import HttpResponse from "./http/response.ts";
import TypeError from "./error/type-error.ts";

import type { Error } from "./error/interfaces/error.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * @var middleware All loaded middleware.
   */
  private middleware: CallableFunction[];

  /**
   * Initialise a kernel object.
   *
   * @constructor
   */
  constructor() {
    this.middleware = [];
  }

  /**
   * Add a new middleware to the stack.
   *
   * @param middleware A callable middleware.
   */
  public use(middleware: CallableFunction) {
    this.middleware.push(middleware);
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options: { port: number }) {
    const { port } = options;

    Deno.serve({ port }, async (request: Request) => {
      const context = new Context(
        new HttpRequest(request),
        new HttpResponse(null),
      );

      try {
        for (let i = 0; i < this.middleware.length; i++) {
          await this.middleware[i](context);
        }

        const hasBody = await context.response.hasBody();

        if (!hasBody) {
          throw new TypeError(
            "No response body was provided in context, are you missing a return?",
          );
        }
      } catch (error) {
        return this.handleError(context, error as Error);
      }

      return new Response(
        context.response.body,
        {
          status: context.response.status,
          headers: context.response.headers,
        },
      );
    });
  }

  /**
   * Handles an error and returns a response.
   *
   * @param context The current http context.
   * @param error The error thrown by the application.
   * @returns void
   */
  private handleError(context: Context, error: Error): Response {
    context.response.body = error.message;
    context.response.status = error.status;

    if (context.response.headers.get("content-type") === "application/json") {
      context.response.body = error;
    }

    return new Response(
      context.response.body,
      {
        status: context.response.status,
        headers: context.response.headers,
      },
    );
  }
}
