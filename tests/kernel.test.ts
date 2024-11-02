import "npm:reflect-metadata@0.2.2";

import { assertEquals } from "jsr:@std/assert";

import { container } from "npm:tsyringe@^4.8.0";
import { type Context, Kernel, Middleware, ServiceProvider } from "../mod.ts";

Deno.test("test kernel handles HTTP response", async () => {
  const kernel = new Kernel();

  class TestMiddleware extends Middleware {
    public override handler(context: Context): void {
      context.response.body = "Test Successful";
    }
  }

  class TestServiceProvider extends ServiceProvider {
    public override register(): void {
      container.registerInstance("middleware", new TestMiddleware());
    }
  }

  kernel.add(new TestServiceProvider());

  const response = await kernel["handleResponse"](
    new Request("http://localhost:8001"),
  );

  const body = await response.text();

  assertEquals(body, "Test Successful");

  container.clearInstances();
});

Deno.test("test kernel handles invalid HTTP response", async () => {
  const kernel = new Kernel();

  const response = await kernel["handleResponse"](
    new Request("http://localhost:8001"),
  );

  const body = await response.text();

  assertEquals(
    body,
    'Attempted to resolve unregistered dependency token: "middleware"',
  );

  container.clearInstances();
});

Deno.test("test kernel updates middleware context", async () => {
  const kernel = new Kernel();

  class TestContentType extends Middleware {
    public override handler(context: Context): void {
      context.response.headers.set("content-type", "application/json");
    }
  }

  class TestServiceProvider extends ServiceProvider {
    public override register(): void {
      container.registerInstance("middleware", new TestContentType());
    }
  }

  kernel.add(new TestServiceProvider());

  const response = await kernel["handleResponse"](
    new Request("http://localhost:8001"),
  );

  assertEquals(response.headers.get("content-type"), "application/json");

  container.clearInstances();
});
