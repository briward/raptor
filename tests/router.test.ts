import {
  assertEquals,
  assertRejects,
  assertArrayIncludes,
} from "jsr:@std/assert";

import {
  Router,
  Request,
  Response,
  type Route,
  type Context as ContextType,
} from "../mod.ts";

import Context from "../src/http/context.ts";

Deno.test("test router accepts new route", () => {
  const router = new Router();

  const route: Route = {
    name: "test.route",
    pathname: new URLPattern("/test-route", "http://test.com"),
    method: "GET",
    action: (context: ContextType) => {
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
    action: (context: ContextType) => {
      console.log(context);
    },
  };

  const routeTwo: Route = {
    name: "test.route_2",
    pathname: new URLPattern("/test-route-2", "http://test.com"),
    method: "GET",
    action: (context: ContextType) => {
      console.log(context);
    },
  };

  router.addRoutes([routeOne, routeTwo]);

  assertArrayIncludes(router.routes, [
    routeOne,
    routeTwo,
  ]);
});

Deno.test("test route influences context response", async () => {
  const router = new Router();

  const route: Route = {
    name: "test.route",
    pathname: new URLPattern("/test-route", "http://test.com"),
    method: "GET",
    action: (context: ContextType) => {
      context.response.body = JSON.stringify({
        influence: true,
      })
    },
  };

  router.addRoute(route);

  const context = new Context(
    new Request(new URL("http://test.com/test-route")),
    new Response(null)
  );

  await router.handle(context);

  assertEquals(context.response.body as unknown, JSON.stringify({
    influence: true,
  }));
});

Deno.test("test unknown route throws not found", () => {
  const router = new Router();

  const route: Route = {
    name: "test.route",
    pathname: new URLPattern("/test-route", "http://test.com"),
    method: "GET",
    action: (context: ContextType) => {
      context.response.body = JSON.stringify({
        influence: true,
      })
    },
  };

  router.addRoute(route);

  const context = new Context(
    new Request(new URL("http://test.com/unknown-route")),
    new Response(null)
  );

  assertRejects(() => router.handle(context));
});

Deno.test("test context contains route params", () => {
  const router = new Router();

  const route: Route = {
    name: "test.route",
    pathname: new URLPattern("/test/:id", "http://test.com"),
    method: "GET",
    action: () => {},
  };

  router.addRoute(route);

  const context = new Context(
    new Request(new URL("http://test.com/test/1")),
    new Response(null)
  );

  router.handle(context).then(() => {
    assertEquals(context.params.id, "1");
  });
});
