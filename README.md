<p align="center">
  <img src="./assets//logo.svg" width="300" />
</p>

<p align="center">
  <a href="https://github.com/briward/raptor/actions"><img src="https://github.com/briward/raptor/workflows/ci/badge.svg" alt="Build Status"></a>
  <a href="jsr.io/@briward/raptor"><img src="https://jsr.io/badges/@briward/raptor?logoColor=CD404F&color=CD404F&labelColor=083344" /></a>
  <a href="jsr.io/@briward/raptor score"><img src="https://jsr.io/badges/@briward/raptor/score?logoColor=CD404F&color=CD404F&labelColor=083344" /></a>
  <a href="https://jsr.io/@briward"><img src="https://jsr.io/badges/@briward?logoColor=CD404F&color=CD404F&labelColor=083344" alt="" /></a>
</p>

# About Raptor

Raptor is a container-based middleware framework written for use with Deno.

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

Raptor is also available to import directly via JSR:
[https://jsr.io/@briward/raptor](https://jsr.io/@briward/raptor)

```ts
import { type Context, Kernel } from "jsr:@briward/raptor";
```

## HTTP Middleware

HTTP Middleware can be added to the container using the `add` method of the application Kernel. Each middleware should implement the Raptor Middleware interface and will be processed during the `serve` method.

```ts
import { type Context, Kernel } from "jsr:@briward/raptor";

const app = new Kernel();

app.add({
  handler: (context: Context) => {
    context.response.body = 'Hello world!';
  }
});

app.serve({ port: 3000 });
```

### Middleware Context

The context object is provided as the first parameter of a middleware handler function. This object contains the following type properties:

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

### Adding routes to the router

```ts
import { 
  Kernel, 
  type Context, 
  Router, 
  Route 
} from "jsr:@briward/raptor";

const app = new Kernel();

const router = new Router();

const route = new Route({
  name: "person.read",
  method: "GET",
  pathname: new URLPattern("/person/:name");
  handler: (context: Context) => {
    const { name } = context.params;

    context.response.body = `Hello ${name}`;
  }
});

router.add(route);

app.add(router);
```

### Route parameters

Route parameters are processed and available via Context (`context.params`) if
they are present in the URLPattern pathname.

### Returning JSON responses

If a JSON object is assigned to the response body then the response content-type will be automatically set to `application/json`. You can override the header by manually assigning it within a middleware callback as follows:

```ts
app.add({
  handler: (context: Context) => {
    context.response.headers.set('content-type', 'text/plain');
  }
});
```

## Error handling

Errors are caught and returned in the response object. If the JSON content-type
is set within a middleware callback, all errors thrown in subsequent callbacks
will respond with JSON, by design.

# License

_Copyright 2024, @briward. All rights reserved. The framework is licensed under
the MIT license._
