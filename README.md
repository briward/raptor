<p align="center">
  <img src="./assets//logo.png" width="300" />
</p>

<p align="center">
  <a href="https://github.com/briward/raptor/actions"><img src="https://github.com/briward/raptor/workflows/ci/badge.svg" alt="Build Status"></a>
  <a href="jsr.io/@raptor/framework"><img src="https://jsr.io/badges/@raptor/framework?logoColor=3A9D95&color=3A9D95&labelColor=083344" /></a>
  <a href="jsr.io/@raptor/framework score"><img src="https://jsr.io/badges/@raptor/framework/score?logoColor=3A9D95&color=3A9D95&labelColor=083344" /></a>
  <a href="https://jsr.io/@raptor"><img src="https://jsr.io/badges/@raptor?logoColor=3A9D95&color=3A9D95&labelColor=083344" alt="" /></a>
</p>

# Introduction

Raptor is a lightweight middleware framework for Deno, focusing on readability and clear code. It balances functionality and simplicity, enabling you to express complex logic concisely.

# Usage

> [!NOTE]
> This is currently under heavy development and is not yet suitable for production use. Please proceed with caution.

## Installation

To start using Raptor, simply install it through the CLI or import it directly from JSR.

### Using the Deno CLI

```
deno add jsr:@raptor/framework
```

### Importing with JSR

Raptor is also available to import directly via JSR:
[https://jsr.io/@raptor/framework](https://jsr.io/@raptor/framework)

## Middleware

Raptor's kernel will run through and process each middleware in the order they were added to the stack. However, if you wish to process the next middleware within another, you can use the built-in `next` argument which is provided to the callback (see "Calling the next middleware").

```ts
// main.ts

import { type Context, Kernel } from "jsr:@raptor/framework";

const app = new Kernel();

app.add(() => 'Hello, Dr Malcolm!');

app.serve({ port: 8000 });
```

To run this code with Deno:

```
> deno run --allow-net main.ts
```

### Response

In Raptor, at least one middleware function is required to return a body response to ensure that the request cycle completes successfully. The `Content-Type` of your response will be automatically determined by the framework, allowing you to focus on your own application code.

#### Returning JSON

If the middleware response body is an object, it will be automatically recognized as `application/json`. Consequently, both the `Content-Type` header and the response body will be appropriately set to reflect this format.

```ts
app.add(() => ({
  name: 'Dr Ian Malcolm',
}));
```

#### Returning HTML

When a string is returned, the `Content-Type` header is automatically set to `text/plain`. However, if the string is detected to contain HTML, the `Content-Type` header will be automatically adjusted to `text/html`.

```ts
app.add(() => '<h1>Hello, Dr Malcolm!</h1>');
```

#### Overriding headers

Although it's convenient to return data without configuring a `Content-Type`, there may be instances where you need to specify a particular header. In such cases, you can proceed as follows:

```ts
app.add((context: Context) => {
  context.response.headers.set('Content-Type', 'application/hal+json');

  return {
    name: 'Dr Ian Malcolm'
  }
});
```

### Context

The context object is passed as the first parameter to a middleware function. It includes the HTTP request, the HTTP response, and any additional properties added by previous middleware calls.

### Calling the next middleware

The next middleware function is responsible for invoking the subsequent middleware in the stack. It must be called if the current middleware doesn't handle the request and provide a response; otherwise, the system will respond with an error. As an example, the following script demonstrates how to calculate runtime across two middleware:

```ts
app.add(async (_context: Context, next: CallableFunction) => {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;

  console.log(`${ms}ms`);
});

app.add(async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  return 'Hello, Dr Malcolm!';
});

// console: ~3004ms
```

## Error handling

Errors thrown in middleware are picked up and added to the `Context` object, allowing you to catch and handle them in a final middleware callback. As with standard middleware responses, content types and HTTP status codes are automatically assigned, but you can override them if needed.

> [!NOTE]
> By default, the system will automatically catch errors for you so you don't have to. You can change this using the optional kernel options. See "Disable automatic catching of errors".

```ts
import { type Context, NotFound } from "jsr:@raptor/framework";

// Simulate an application error.
app.add((context: Context) => {
  throw new NotFound();
});

// Catch our error and handle response.
app.add((context: Context) => {
  const { error, response } = context;

  if (error?.status === 404) {
    return '<h1>No page could be found</h1>'
  }

  response.status = 500;
  return '<h1>There was a server error</h1>'
});
```

The following errors are currently available to import and throw from within the framework:

* `NotFound`
* `BadRequest`
* `ServerError`
* `TypeError`

You can create your own errors by implementing the `Error` interface.

### Disable automatic catching of errors

If you prefer to manage errors manually, you can disable the automatic error catching feature in the Kernel options. When you do this, it's essential to add a middleware callback to check for errors and handle the responses accordingly.

```ts
const app = new Kernel({
  catchErrors: false,
})
```

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

Raptor is built as an unopinionated modular framework, giving you the flexibility to choose which components to include. Below is a list of available first-party extensions:

* Router Middleware: [https://jsr.io/@raptor/router](https://jsr.io/@raptor/router)

# License

_Copyright 2024, @briward. All rights reserved. The framework is licensed under
the MIT license._
