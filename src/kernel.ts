import Context from "./http/context.ts";
import HttpResponse from "./http/response.ts";
import HttpRequest from "./http/request.ts";

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
        new HttpResponse(''),
        {}
      );

      try {  
        for (let i = 0; i < this.middleware.length; i++) {
          await this.dispatch(i, context);
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

  private async dispatch(i: number, context: Context) {
    const middleware = this.middleware[i];

    await middleware(context, this.dispatch.bind(null, i++));
  }
};
