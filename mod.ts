// Copyright 2024, @briward. All rights reserved. MIT license.

import Kernel from "@amber/kernel.ts";
import Router from "@amber/http/router.ts";
import Mailer from "@amber/mail/mailer.ts";
import Request from "@amber/http/request.ts";
import Response from "@amber/http/response.ts";
import NotFound from "@amber/error/not-found.ts";
import ModuleLoader from "@amber/module/loader.ts";
import BadRequest from "@amber/error/bad-request.ts";
import ServerError from "@amber/error/server-error.ts";
import DatabaseManager from "@amber/database/manager.ts";

// Export all available interfaces/types.
export type { Route } from "@amber/interfaces/route.ts";
export type { Error } from "@amber/interfaces/error.ts";
export type { Context } from "@amber/interfaces/context.ts";
export type { ModuleConfig } from "@amber/interfaces/module.ts";

export {
  Kernel,
  Router,
  Mailer,
  Request,
  Response,
  NotFound,
  BadRequest,
  ServerError,
  ModuleLoader,
  DatabaseManager,
};
