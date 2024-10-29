import Context from "./http/context.ts";
import HttpRequest from "./http/request.ts";
import HttpResponse from "./http/response.ts";
import TypeError from "./error/type-error.ts";

import type { Error } from "./error/interfaces/error.ts";
import type Middleware from "./http/interfaces/middleware.ts";
import { container, type DependencyContainer } from 'npm:tsyringe@^4.4.0';

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * @var DependencyContainer The dependency injection container.
   */
  private container: DependencyContainer;

  /**
   * Initialise a kernel object.
   *
   * @constructor
   */
  constructor() {
    this.container = container;
  }

  /**
   * Add a new middleware to the container.
   *
   * @param middleware A middleware instance.
   */
  public add(middleware: Middleware) {
    this.container.registerInstance<Middleware>('middleware', middleware);
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
        const middleware : Middleware[] = this.container.resolveAll('middleware');

        for (let i = 0; i < middleware.length; i++) {
          await middleware[i].handler(context);
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
   * Fetch the application container.
   *
   * @returns {DependencyContainer} The app container.
   */
  public getContainer(): DependencyContainer {
    return this.container;
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

    if (context.response.isJson()) {
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
