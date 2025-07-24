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
   * An optional custom error middleware function.
   */
  private errorMiddleware?: CallableFunction;

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

    const handler = (request: Request) => this.respond(request);

    if (!port) {
      Deno.serve(handler);

      return;
    }

    Deno.serve({ port }, handler);
  }

  /**
   * Handle an HTTP request and respond.
   *
   * @param request
   * @returns A promise resolving the HTTP response.
   */
  public async respond(request: Request): Promise<Response> {
    // Create a new context for this request
    const context = new Context(request.clone(), new Response());

    await this.next(context);

    return context.response;
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
   * Add custom error handling middleware.
   *
   * @param middleware A middleware function to handle errors.
   * @returns void
   */
  public catch(middleware: CallableFunction): void {
    this.errorMiddleware = middleware;
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
    await this.executeMiddleware(context, 0);
  }

  /**
   * Execute a chosen middleware by index.
   *
   * @param context The current HTTP context.
   * @param index The current middleware index.
   * @returns Promise<void>
   */
  private async executeMiddleware(
    context: Context,
    index: number,
  ): Promise<Response | void> {
    if (index >= this.middleware.length) return;

    const middleware = this.middleware[index];

    let called = false;

    const next = async () => {
      if (called) return;

      called = true;

      index++;

      await this.executeMiddleware(context, index);
    };

    try {
      const body = await middleware(context, next);

      if (called || !body) return;

      await this.processMiddlewareResponse(body, context);
    } catch (error) {
      await this.processUncaughtError(error as Error, context);
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

    context.response = processed;
  }

  /**
   * Process an uncaught error with HTTP context.
   *
   * @param error The uncaught error object to process.
   * @param context The current HTTP context object.
   * @returns Promise<void>
   */
  private async processUncaughtError(
    error: Error,
    context: Context,
  ): Promise<void> {
    if (this.options?.catchErrors || !this.errorMiddleware) {
      await this.uncaughtErrorHandler(error as Error, context);

      return;
    }

    const errorBody = await this.errorMiddleware(error as Error, context);

    await this.processMiddlewareResponse(errorBody, context);
  }

  /**
   * Handle the uncaught error internally.
   *
   * @param error The uncaught error object to handle.
   * @param context The current HTTP context object.
   * @returns Promise<void>
   */
  private async uncaughtErrorHandler(
    error: Error,
    context: Context,
  ): Promise<void> {
    context.response = new Response(
      error.message,
      {
        status: error.status || 500,
      },
    );
  }
}
