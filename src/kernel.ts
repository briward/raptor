import Context from "./http/context.ts";
import HttpResponse from "./http/response.ts";
import type { Error } from "./error/interfaces/error.ts";
import ResponseManager from "./http/response-manager.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * The current HTTP context.
   */
  private context: Context;

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
    this.context = new Context(
      new Request("http://localhost"),
      new HttpResponse(null),
    );

    this.responseManager = new ResponseManager(this.context);
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
    this.context.request = request;

    await this.next();

    return this.context.response.clone();
  }

  /**
   * Handle the processing of middleware.
   *
   * @returns Promise<void>
   */
  public async next(): Promise<void> {
    // Process an individual middleware by index.
    const execute = async (index: number) => {
      let called = false;

      if (index < this.middleware.length) {
        const middleware = this.middleware[index];

        try {
          // Call the middleware and provide context and next callback.
          const body = await middleware(
            this.context,
            async () => {
              called = true;
              await execute(index + 1);
            },
          );

          // If we should attempt processing.
          if (!called) {
            this.context.response = this.responseManager.process(body);
          }
        } catch (error) {
          // We've hit an error, pass to next middleware for handling.
          this.context.response.status = (error as Error).status;
          this.context.error = error as Error;

          await execute(index + 1);
        }
      }
    };

    // Execute the first middleware.
    await execute(0);
  }
}
