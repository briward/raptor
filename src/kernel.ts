// deno-lint-ignore-file no-explicit-any

import Context from "./http/context.ts";

import type { Error } from "./error/interfaces/error.ts";

/**
 * The root initialiser for the framework.
 */
export default class Kernel {
  /**
   * The current HTTP context.
   */
  private context: Context;

  /**
   * The available middleware.
   */
  private middleware: CallableFunction[] = [];

  /**
   * The current middleware index.
   */
  private currentIndex: number = 0;

  /**
   * Initialise the kernel.
   *
   * @constructor
   */
  constructor() {
    this.context = new Context(
      new Request(Deno.env.get("APP_URL") as string),
      new Response(null),
    );
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
   * @returns
   */
  public async respond(request: Request): Promise<Response> {
    this.context.request = request;

    try {
      await this.next();

      return this.context.response.clone();
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  public async next(): Promise<void> {
    // Process an individual middleware by index.
    const execute = async (index: number) => {
      let called = false;

      if (index < this.middleware.length) {
        const middleware = this.middleware[index];

        const body = await middleware(
          this.context,
          async () => {
            called = true;
            await execute(index + 1);
          },
        );

        if (!called) {
          this.context.response = this.process(body);
        }
      }
    };

    // Execute the first middle.
    await execute(0);
  }

  /**
   * Process middleware into an HTTP response.
   *
   * @param body The response body.
   * @returns
   */
  private process(body: any): Response {
    // If the middleware provides a Response object, use it.
    if (body instanceof Response) {
      return body;
    }

    const hasContentType = this.context.response.headers.get("content-type");

    // If the middleware returns an object, process it as JSON.
    if (typeof body === "object") {
      if (!hasContentType) {
        this.context.response.headers.set("content-type", "application/json");
      }

      return new Response(JSON.stringify(body), {
        headers: this.context.response.headers,
      });
    }

    // If the middleware returns a string, process plain text or HTML.
    if (typeof body === "string") {
      const isHtml = (new RegExp(/<[a-z/][\s\S]*>/i)).test(body);

      if (!hasContentType) {
        this.context.response.headers.set("content-type", "text/plain");
      }

      if (isHtml && !hasContentType) {
        this.context.response.headers.set("content-type", "text/html");
      }

      return new Response(body as string, {
        headers: this.context.response.headers,
      });
    }

    return new Response(body as string);
  }

  /**
   * Handles an error and returns a response.
   *
   * @param error The error thrown by the application.
   * @returns void
   */
  private handleError(error: Error): Response {
    return new Response(
      error.message,
      {
        status: error.status,
        headers: this.context.response.headers,
      },
    );
  }
}
