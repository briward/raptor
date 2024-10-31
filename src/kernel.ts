import Context from "./http/context.ts";
import HttpRequest from "./http/request.ts";
import HttpResponse from "./http/response.ts";
import TypeError from "./error/type-error.ts";

import type { Error } from "./error/interfaces/error.ts";
import type ServiceProvider from "./container/service-provider.ts";

import { container, type DependencyContainer } from "npm:tsyringe@^4.8.0";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * @var DependencyContainer The dependency injection container.
   */
  public container: DependencyContainer;

  /**
   * Initialise a kernel object.
   *
   * @constructor
   */
  constructor() {
    this.container = container;
  }

  /**
   * Add a new module to the container.
   *
   * @param module A module instance.
   */
  public add(module: ServiceProvider) {
    this.container.registerInstance<ServiceProvider>('provider', module);
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options: { port: number }) {
    const { port } = options;

    this.registerServiceProviders();

    Deno.serve({ port }, async (request: Request) => {
      const context = new Context(
        new HttpRequest(request),
        new HttpResponse(null),
      );

      try {
        const middleware: any[] = this.container.resolveAll(
          "middleware",
        );

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

  /**
   * Run the register method of all loaded service providers.
   *
   * @returns void
   */
  private registerServiceProviders(): void {
    const providers : ServiceProvider[] = this.container.resolveAll('provider');

    providers.forEach((provider) => provider.register());
  }
}
