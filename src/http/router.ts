import NotFound from "../error/not-found.ts";
import ParamParser from "../http/param-parser.ts";

import type { Context } from "../interfaces/context.ts";
import type { Route } from "../interfaces/route.ts";

export default class Router {
  public routes : Route[];

  constructor() {
    this.routes = [];
  }

  public addRoutes(routes: Route[]) {
    this.routes = [...this.routes, ...routes];
  }

  public async handle(context: Context) {
    const { request } = context;
  
    const route = this.getRouteFromRequest(request);

    if (!route || request.method !== route.method) {
      throw new NotFound();
    }

    const parser = new ParamParser(route.pathname, request.url);
    const params = parser.parse();

    context.params = params;

    await route.action(context);
  }

  private getRouteFromRequest(request: Request) : Route | null {
    const route = this.routes.find(({ pathname }) => pathname.exec(request.url))

    if (!route) {
      return null;
    }
  
    return route;
  }
};
