# raptor

[![jsr.io/@oak/oak](https://jsr.io/badges/@briward/raptor)](https://jsr.io/@briward/raptor)
[![jsr.io/@briward/raptor score](https://jsr.io/badges/@briward/raptor/score)](https://jsr.io/@briward/raptor)

A tiny middleware framework written for use with Deno.

This framework is heavily inspired by many who came before it, such as Oak,
Express and Slim Framework in PHP.

# Usage

> [!NOTE]
> This is under heavy development and not yet suitable for production use, you
> have been warned.

## Installation

### Using the Deno CLI

```
deno add @briward/raptor
```

### Importing with JSR

raptor is also available to import directly via JSR:
[https://jsr.io/@briward/raptor](https://jsr.io/@briward/raptor)

```ts
import { type Context, Kernel } from "jsr:@briward/raptor";
```

## Middleware

Middleware can be added using the `use` method of the application Kernel. Each
middleware's callback will be processed during the `serve` method.

```ts
import { type Context, Kernel } from "jsr:@briward/raptor";

const app = new Kernel();

app.use((context: Context) => {
  context.response.body = JSON.stringify({
    hello: "world",
  });
});

app.serve({ port: 3000 });
```

### Middleware Context

The context object is provided as the first parameter of a middleware callback
function. This object contains the following type properties:

```ts
{
  request: HttpRequest,
  response: HttpResponse,
  params: RouteParams,
}
```

## Using the built-in router middleware

The built-in router works in the same way as regular middleware, allowing you to
pass in routes using Web API standard URL patterns. See
[mozilla.org/URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
for more information.

### Initialising the router

```ts
import { Kernel, type Context, Router, Route } from "jsr:@briward/raptor";

const app = new Kernel();

const router = new Router();

const route = new Route({
  name: "person.read",
  method: "GET",
  pathname: new URLPattern("/person/:name");
  callback: (context: Context) => {
    const { name } = context.params;

    context.response.body = `Hello ${name}`;
  }
});

router.add(route);

app.use((context: Context) => router.handle(context));
```

### Route parameters

Route parameters are processed and available via Context (`context.params`) if
they are present in the URLPattern pathname.

### Returning JSON responses

For ease of development, the ability to return JSON responses from a callback is
built-in. You can do this by defining the JSON content-type header in an initial
callback.

```ts
app.use((context: Context) => {
  context.response.headers.set("Content-Type", "application/json");
});

app.use((context: Context) => {
  context.response.body = {
    data: {
      name: "Deno",
    },
  };
});
```

## Error handling

Errors are caught and returned in the response object. If the JSON content-type
is set within a middleware callback, all errors thrown in subsequent callbacks
will respond with JSON, by design.

# License

_Copyright 2024, @briward. All rights reserved. The framework is licensed under
the MIT license._
