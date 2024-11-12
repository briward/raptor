// deno-lint-ignore-file

import Context from "./http/context.ts";
import HttpResponse from "./http/response.ts";
import type { Error } from "./error/interfaces/error.ts";
import ResponseManager from "./http/response-manager.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
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
  constructor() {
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
    const context = new Context(request.clone(), new HttpResponse(null));

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
   * Handle the processing of middleware.
   *
   * @param context The current HTTP context.
   * @returns void
   */
  private async next(context: Context): Promise<void> {
    await this.executeMiddleware(0, context);
  }

  private async executeMiddleware(index: number, context: Context): Promise<void> {
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

      if (!called && body) {
        await this.processResponse(body, context);
      }
    } catch (error) {
      await this.handleError(error as Error, context);
      await this.executeMiddleware(index + 1, context);
    }
  };

  private async processResponse(body: any, context: Context): Promise<void> {
    const processed = await this.responseManager.process(body, context);

    if (processed) {
      context.response = processed;
    }
  };

  private async handleError(error: Error, context: Context): Promise<void> {
    context.error = error;
    context.response.status = error.status || 500;

    await this.processResponse(error, context);
  };
}
