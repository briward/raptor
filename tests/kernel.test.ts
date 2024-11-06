import { assertEquals } from "jsr:@std/assert";

import { type Context, Kernel } from "../mod.ts";

const APP_URL = "http://localhost:8000";

Deno.test("test kernel handles plain text HTTP response", async () => {
  const app = new Kernel();

  app.add(() => "Test Successful");

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "text/plain");
  assertEquals(await response.text(), "Test Successful");
});

Deno.test("test kernel handles JSON HTTP response", async () => {
  const app = new Kernel();

  app.add(() => ({ value: "Test" }));

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "application/json");
  assertEquals(await response.json(), { value: "Test" });
});

Deno.test("test kernel handles HTML HTTP response", async () => {
  const app = new Kernel();

  app.add(() => "<h1>Test</h1>");

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "text/html");
  assertEquals(await response.text(), "<h1>Test</h1>");
});

Deno.test("test kernel updates middleware context", async () => {
  const app = new Kernel();

  app.add((ctx: Context) => {
    ctx.response.headers.set("content-type", "application/json");

    return "Hello, Dr Malcolm!";
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(response.headers.get("content-type"), "application/json");
});

Deno.test("test middleware next callback functionality", async () => {
  const app = new Kernel();

  app.add((_ctx: Context, next: CallableFunction) => {
    next();

    return "Hello from the first middleware";
  });

  app.add(() => {
    return "Hello from the second middleware";
  });

  const response = await app.respond(new Request(APP_URL));

  assertEquals(await response.text(), "Hello from the second middleware");
});
