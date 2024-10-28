import type Route from "./route.ts";
import NotFound from "../error/not-found.ts";
import ParamParser from "../http/param-parser.ts";

import type { Context } from "../interfaces/context.ts";

export default class Router {
  public routes: Route[];

  constructor() {
    this.routes = [];
  }

  public add(routes: Route | Route[]): void {
    if (Array.isArray(routes)) {
      this.addRoutes(routes);

      return;
    }

    this.addRoute(routes);
  }

  public addRoute(route: Route): void {
    this.routes = [
      ...this.routes,
      route,
    ];
  }

  public addRoutes(routes: Route[]): void {
    this.routes = [...this.routes, ...routes];
  }

  public async handle(context: Context) {
    const { request } = context;

    const route = this.getRouteFromRequest(request);

    if (!route || request.method !== route.options.method) {
      throw new NotFound();
    }

    const parser = new ParamParser(route.options.pathname, request.url);
    const params = parser.parse();

    context.params = params;

    await route.options.action(context);
  }

  private getRouteFromRequest(request: Request): Route | null {
    const route = this.routes.find(({ options }) =>
      options.pathname.exec(request.url)
    );

    if (!route) {
      return null;
    }

    return route;
  }
};
