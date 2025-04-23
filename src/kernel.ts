// deno-lint-ignore-file

import Context from "./http/context.ts";
import { KernelOptions } from "./kernel-options.ts";
import type { Error } from "./error/interfaces/error.ts";
import ResponseManager from "./http/response-manager.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * Optional configuration options for the kernel.
   */
  private options?: KernelOptions;

  /**
   * The response manager for the kernel.
   */
  private responseManager: ResponseManager;

  /**
   * The available middleware.
   */
  private middleware: CallableFunction[] = [];

  /**
   * Initialise the kernel.
   *
   * @constructor
   */
  constructor(options?: KernelOptions) {
    this.options = this.initialiseDefaultOptions(options);

    this.responseManager = new ResponseManager();
  }

  /**
   * Add a new module to the container.
   *
   * @param middleware An HTTP middleware instance.
   */
  public add(middleware: CallableFunction) {
    this.middleware.push(middleware);
  }

  /**
   * Serve the application.
   *
   * @param options Server options.
   */
  public serve(options: { port: number }) {
    const { port } = options;

    Deno.serve({ port }, (request: Request) => {
      return this.respond(request);
    });
  }

  /**
   * Handle an HTTP request and respond.
   *
   * @param request
   * @returns A promise resolving the HTTP response.
   */
  public async respond(request: Request): Promise<Response> {
    // Create a new context for this request
    const context = new Context(request.clone(), new Response(null));

    // Add safety net for uncaught errors.
    this.handleUncaughtError();

    await this.next(context);

    // If context.response is a Response, return directly
    if (context.response instanceof Response) {
      return context.response;
    }

    // Add safety net for empty responses.
    return new Response("No response body was found.");
  }

  /**
   * Set or override the response manager for the kernel.
   *
   * @param manager A valid response manager object.
   * @returns void
   */
  public setResponseManager(manager: ResponseManager): void {
    this.responseManager = manager;
  }

  /**
   * Initialise the default kernel options.
   *
   * @param options Optional kernel options object.
   * @returns A new kernel options object with defaults.
   */
  private initialiseDefaultOptions(options?: KernelOptions): KernelOptions {
    return {
      catchErrors: true,
      ...options,
    };
  }

  /**
   * Handle the processing of middleware.
   *
   * @param context The current HTTP context.
   * @returns void
   */
  private async next(context: Context): Promise<void> {
    await this.executeMiddleware(0, context);
  }

  /**
   * Execute a chosen middleware by index.
   *
   * @param index The current middleware index.
   * @param context The current HTTP context.
   * @returns Promise<void>
   */
  private async executeMiddleware(
    index: number,
    context: Context,
  ): Promise<void> {
    if (index >= this.middleware.length) return;

    const middleware = this.middleware[index];

    let called = false;

    const next = async () => {
      if (called) return;

      called = true;

      await this.executeMiddleware(index + 1, context);
    };

    try {
      const body = await middleware(context, next);

      if (called || !body) return;

      await this.processMiddlewareResponse(body, context);
    } catch (error) {
      await this.handleMiddlewareError(error as Error, context);
      await this.executeMiddleware(index + 1, context);
    }
  }

  /**
   * Process an unknown response body with HTTP context.
   *
   * @param body An unknown response body to process.
   * @param context The current HTTP context.
   */
  private async processMiddlewareResponse(
    body: any,
    context: Context,
  ): Promise<void> {
    const processed = await this.responseManager.process(body, context);

    if (!processed) return;

    context.response = processed;
  }

  /**
   * Handle an HTTP error.
   *
   * @param error The caught error object.
   * @param context The current HTTP context.
   */
  private async handleMiddlewareError(
    error: Error,
    context: Context,
  ): Promise<void> {
    context.error = error;

    context.response = new Response(
      context.response.body,
      {
        status: error.status || 500
      }
    );
  }

  /**
   * Handle unhandled errors with a saftey net middleware.
   *
   * @returns void
   */
  private handleUncaughtError(): void {
    if (!this.options?.catchErrors) return;

    this.add((context: Context) => {
      if (!context.error) return;

      return context.error.message;
    });
  }
}
