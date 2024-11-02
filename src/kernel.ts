import Context from "./http/context.ts";
import HttpRequest from "./http/request.ts";
import HttpResponse from "./http/response.ts";
import TypeError from "./error/type-error.ts";

import type { Error } from "./error/interfaces/error.ts";
import type { Middleware } from "./http/interfaces/middleware.ts";
import type ServiceProvider from "./container/service-provider.ts";

import { container, type DependencyContainer } from "npm:tsyringe@^4.8.0";

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
   * Add a new module to the container.
   *
   * @param provider A service provider instance.
   */
  public add(provider: ServiceProvider) {
    this.container.registerInstance<ServiceProvider>("provider", provider);

    // Fetch all registered service providers.
    const providers = this.container.resolveAll<ServiceProvider>("provider");

    // Register all bound services from service providers.
    providers.forEach((provider) => provider.register());
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options: { port: number }) {
    const { port } = options;

    Deno.serve({ port }, (request: Request) => {
      return this.handleResponse(request);
    });
  }

  /**
   * Get the dependency injection container from the kernel.
   *
   * @returns The dependency injection container.
   */
  public getContainer(): DependencyContainer {
    return this.container;
  }

  /**
   * Handle the HTTP request and response.
   *
   * @param request The current HTTP request.
   * @returns A resolved Response as promise.
   */
  private async handleResponse(request: Request): Promise<Response> {
    const context = new Context(
      new HttpRequest(request),
      new HttpResponse(null),
    );

    try {
      const middleware: Middleware[] = this.container.resolveAll(
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
