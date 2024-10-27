import Context from "./http/context.ts";
import HttpRequest from "./http/request.ts";
import HttpResponse from "./http/response.ts";
import TypeError from "./error/type-error.ts";

export default class Kernel {
  private middleware : CallableFunction[];

  constructor() {
    this.middleware = [];
  }

  public use(middleware: CallableFunction) {
    this.middleware.push(middleware);
  }

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

        if (!context.response.body) {
          throw new TypeError(
            'No response body was provided in context, are you missing a return?'
          );
        }
      } catch (error) {
        context.response.body = JSON.stringify(error);
        context.response.status = (error as { status: number }).status;
      }

      return new Response(
        context.response.body,
        {
          status: context.response.status,
          headers: context.response.headers,
        }
      );
    });
  }
};
