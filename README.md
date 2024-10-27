# amber

[![jsr.io/@oak/oak](https://jsr.io/badges/@briward/amber)](https://jsr.io/@briward/amber)
[![jsr.io/@briward/amber score](https://jsr.io/badges/@briward/amber/score)](https://jsr.io/@briward/amber)

A tiny middleware framework written for use with Deno.

This framework is heavily inspired by many who came before it, such as Oak,
Express and Slim Framework in PHP.

# Usage

> [!NOTE]
> This is under heavy development and not yet suitable for production use, you
> have been warned.

## Installation

Amber is available to import directly via JSR:
[https://jsr.io/@briward/amber](https://jsr.io/@briward/amber)

```ts
import { Kernel } from "jsr:@briward/amber";
```

## Using the middleware kernel

```ts
const app = new Kernel();

app.use((context: Context) => {
  context.response.body = JSON.stringify({
    hello: "world",
  });
});

app.serve({ port: 3000 });
```

## Using the built-in router middleware

The built-in router works in the same way as regular middleware, allowing you to
pass in routes using Web API standard URL patterns. See
[mozilla.org/URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
for more information.

```ts
const router = new Router();

router.addRoute({
  name: "home";
  pathname: new URLPattern("/pages/:id");
  method: "GET";
  action: (context: Context) => {
    const { id } = context.params;

    context.response.body = JSON.stringify({
      id,
    }
  }
});

app.use((context: Context) => router.handle(context));
```

---

Copyright 2024, @briward. All rights reserved. MIT license.
