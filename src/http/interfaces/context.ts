import type HttpRequest from "../request.ts";
import type HttpResponse from "../response.ts";

export interface Params {
  [key: string]: string;
}

export interface Context {
  request: HttpRequest;
  response: HttpResponse;
  params: Params;
}
