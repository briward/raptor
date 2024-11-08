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

Raptor is a tiny, unopinionated middleware framework written for use with Deno. The goal of this project is to build a simple, easy to use middleware framework using Web Standards.

This framework is heavily inspired by many who came before it, such as Oak, Express, Laravel and Slim Framework in PHP.

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

## Getting started

HTTP Middleware can be added to the container using the `add` method of the Kernel.

```ts
import { type Context, Kernel } from "jsr:@raptor/framework";

const app = new Kernel();

app.add(() => 'Hello, Dr Malcolm!');

app.serve({ port: 8000 });
```

### Response

With Raptor, setting the response headers is completely optional. Instead, you can simply return the data you wish from the middleware handler and let Raptor decide which content-type header is best for your response.

#### Returning JSON

The following middleware response will be automatically detected as `application/json` and the `content-type` header will be set accordingly.

```ts
app.add(() => ({
  name: 'Dr Ian Malcolm',
}));
```

#### Returning HTML

When returning a string, the `content-type` header will automatically be set to `text/plain`. However, if we return a string which has been detected as including HTML, then it will be automatically set to `text/html`.

```ts
app.add(() => '<h1>Hello, Dr Malcolm!</h1>');
```

#### Overriding headers

While it's great not having to configure a `content-type` and simply return the data we want, we might have the need to decide specifically  which header to set. With that in mind, you can do the following:

```ts
app.add((context: Context) => {
  context.response.headers.set('content-type', 'application/hal+json');

  return {
    name: 'Dr Ian Malcolm'
  }
});
```

### Middleware Context

The context object is provided as the first parameter of a middleware function. This object contains the HTTP Request, the HTTP Response and any other properties that may have been added by prior middleware calls. You can take a look at what is stored in this context below:

```ts
app.add((context: Context) => {
  console.log(context.request, context.response);
});
```

### Calling the next middleware

The next middleware function can be used to call the next middleware in the stack. If the middleware doesn't resolve the request and respond then the `next` function must be called. If the `next` function is not called then the system will hang. The following script will return "Ellie Sattler":

```ts
app.add((_context: Context, next: CallableFunction) => {
  next();

  return {
    name: 'Dr Ian Malcolm'
  }
});

app.add(() => ({
  name: 'Dr Ellie Sattler'
}));
```

## Error handling

Errors are caught and returned in the response object. If the JSON content-type is set within a middleware callback, all errors thrown in subsequent callbacks will respond with JSON, by design.

# Deployment

## Deno Deploy

Raptor was built with Deno in mind, meaning that deploying to Deno Deploy is easy. Within your root directory (alongside your `main.ts` entry file) you can run:

```
deployctl deploy
```

## Cloudflare Worker

You can also deploy your application to a Cloudflare Worker by simply using the `respond` method of the Kernel. This allows you to bypass the usual `serve` method and return a Response directly.

```ts
/* ... */

export default {
  fetch: (request: Request) => {
    return kernel.respond(request);
  }
}
```

Once you've setup your application for Cloudflare Workers, you can run the deployment as usual:

```
npx wrangler deploy
```

# Available extensions

Raptor is designed to be an unopinionated modular framework, allowing you to decide what batteries you wish to include or not. Here is a list of the first-party extensions available:

* Router Middleware: [https://jsr.io/@raptor/router](https://jsr.io/@raptor/router)
* Request Validation (soon...)

# License

_Copyright 2024, @briward. All rights reserved. The framework is licensed under
the MIT license._
