// Copyright 2024, @briward. All rights reserved. MIT license.

import "npm:reflect-metadata";

import Kernel from "./src/kernel.ts";
import Route from "./src/routing/route.ts";
import Request from "./src/http/request.ts";
import Router from "./src/routing/router.ts";
import Response from "./src/http/response.ts";
import NotFound from "./src/error/not-found.ts";
import BadRequest from "./src/error/bad-request.ts";
import ServerError from "./src/error/server-error.ts";

// Export all available interfaces/types.
export type { Error } from "./src/error/interfaces/error.ts";
export type { Context } from "./src/http/interfaces/context.ts";
export type { RouteOptions } from "./src/routing/interfaces/route-options.ts";

export {
  BadRequest,
  Kernel,
  NotFound,
  Request,
  Response,
  Route,
  Router,
  ServerError,
};
