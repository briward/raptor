import type HttpRequest from "../http/request.ts";
import type HttpResponse from "../http/response.ts";

export interface Params {
  [key: string]: string;
}

export interface Context {
  request: HttpRequest;
  response: HttpResponse;
  params: Params;
}
