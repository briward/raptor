import { assertArrayIncludes, assertEquals } from "jsr:@std/assert";

import { type Context, type Route, Router } from "../mod.ts";

Deno.test("test router accepts new route", () => {
  const router = new Router();

  const route: Route = {
    name: "test.route",
    pathname: new URLPattern("/test-route", "https://test.com"),
    method: "GET",
    action: (context: Context) => {
      console.log(context);
    },
  };

  router.addRoute(route);

  assertEquals(router.routes[0].name, route.name);
});

Deno.test("test router accepts new routes", () => {
  const router = new Router();

  const routeOne: Route = {
    name: "test.route_1",
    pathname: new URLPattern("/test-route-1", "https://test.com"),
    method: "GET",
    action: (context: Context) => {
      console.log(context);
    },
  };

  const routeTwo: Route = {
    name: "test.route_2",
    pathname: new URLPattern("/test-route-2", "https://test.com"),
    method: "GET",
    action: (context: Context) => {
      console.log(context);
    },
  };

  router.addRoutes([routeOne, routeTwo]);

  assertArrayIncludes(router.routes, [
    routeOne,
    routeTwo,
  ]);
});
