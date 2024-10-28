# raptor

[![jsr.io/@oak/oak](https://jsr.io/badges/@raptor/framework)](https://jsr.io/@raptor/framework)
[![jsr.io/@raptor/framework score](https://jsr.io/badges/@raptor/framework/score)](https://jsr.io/@raptor/framework)

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
deno add @raptor/framework
```

### Importing with JSR

raptor is also available to import directly via JSR:
[https://jsr.io/@raptor/framework](https://jsr.io/@raptor/framework)

```ts
import { type Context, Kernel } from "jsr:@raptor/framework";
```

## Middleware

Middleware can be added using the `use` method of the application Kernel. Each
middleware's callback will be processed during the `serve` method.

```ts
import { type Context, Kernel } from "jsr:@raptor/framework";

const app = new Kernel();

app.use((context: Context) => {
  context.response.body = 'Hello world!';
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
import { Kernel, type Context, Router, Route } from "jsr:@raptor/framework";

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

If a JSON object is assigned to the response body then the response content-type will be automatically set to `application/json`. You can override the header by manually assigning it within a middleware callback as follows:

```ts
app.use((context: Context) => {
  context.response.headers.set('content-type', 'text/plain');
});
```

## Error handling

Errors are caught and returned in the response object. If the JSON content-type
is set within a middleware callback, all errors thrown in subsequent callbacks
will respond with JSON, by design.

# License

_Copyright 2024, @briward. All rights reserved. The framework is licensed under
the MIT license._
