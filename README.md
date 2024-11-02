<p align="center">
  <img src="./assets//logo.png" width="300" />
</p>

<p align="center">
  <a href="https://github.com/briward/raptor/actions"><img src="https://github.com/briward/raptor/workflows/ci/badge.svg" alt="Build Status"></a>
  <a href="jsr.io/@raptor/framework"><img src="https://jsr.io/badges/@raptor/framework?logoColor=3A9D95&color=3A9D95&labelColor=083344" /></a>
  <a href="jsr.io/@raptor/framework score"><img src="https://jsr.io/badges/@raptor/framework/score?logoColor=3A9D95&color=3A9D95&labelColor=083344" /></a>
  <a href="https://jsr.io/@raptor"><img src="https://jsr.io/badges/@raptor?logoColor=3A9D95&color=3A9D95&labelColor=083344" alt="" /></a>
</p>

# About Raptor

Raptor is an unopinionated, service-orientated middleware framework written for use with Deno.

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

Raptor is also available to import directly via JSR:
[https://jsr.io/@raptor/framework](https://jsr.io/@raptor/framework)

```ts
import { type Context, Kernel } from "jsr:@raptor/framework";
```

## Service Providers

A service provider allows you to register container bindings, which includes middleware that will be processed on each request. At least one middleware needs to be registered with the container otherwise the application will throw an error.

## HTTP Middleware

HTTP Middleware can be added to the container by registering via a Service Provider. Each middleware should implement the Middleware interface and will be processed during the `serve` method.

```ts
import { type Context, Kernel, Middleware, ServiceProvider } from "jsr:@raptor/framework";

const app = new Kernel();

class HelloWorld extends Middleware {
  override handler(context: Context) {
    context.response.body = {
      hello: 'world'
    }
  }
}

class MyService extends ServiceProvider {
  override register() {
    this.container.registerInstance('middleware', new HelloWorld);
  }
}

app.add(new MyService);

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

## Error handling

Errors are caught and returned in the response object. If the JSON content-type
is set within a middleware callback, all errors thrown in subsequent callbacks
will respond with JSON, by design.

# Available modules

Raptor is designed to be an unopinionated modular framework, allowing you to decide what batteries you wish to include or not. Here is a list of the first-party modules available:

* Router middleware: [https://jsr.io/@raptor/router](https://jsr.io/@raptor/router)

# License

_Copyright 2024, @briward. All rights reserved. The framework is licensed under
the MIT license._
