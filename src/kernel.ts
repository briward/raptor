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
  public respond(request: Request): Promise<Response> {
    this.context.request = request.clone();

    return this.next();
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
   * @returns Promise<Response>
   */
  private async next(): Promise<Response> {
    let response = new Response(null);

    // Process an individual middleware by index.
    const execute = async (index: number) => {
      let called = false;

      if (index < this.middleware.length) {
        const middleware = this.middleware[index];

        try {
          const next = async () => {
            called = true;
            await execute(index + 1);
          };

          // Call the middleware and provide context and next callback.
          const body = await middleware(this.context, next);

          // If we should attempt processing.
          if (!called && body) {
            const processed = await this.responseManager.process(
              body,
              this.context,
            );

            if (processed) {
              response = processed;
            };
          }
        } catch (error) {
          this.context.error = (error as Error);
          this.context.response.status = (error as Error).status;

          await execute(index + 1);
        }
      }
    };

    // Execute the first middleware.
    await execute(0);

    return response;
  }
}
