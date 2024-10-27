import type HttpRequest from "./request.ts";
import type HttpResponse from "./response.ts";
import type { Params } from "../interfaces/context.ts";

export default class Context implements Context {
  public request : HttpRequest;
  public response : HttpResponse;
  public params : Params;

  constructor(request: HttpRequest, response: HttpResponse, params?: Params) {
    this.request = request;
    this.response = response;
    this.params = params || {};
  }
};
