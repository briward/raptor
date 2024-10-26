import type HttpRequest from "@amber/http/request.ts";
import type HttpResponse from "@amber/http/response.ts";
import type { Params } from "@amber/interfaces/context.ts";

export default class Context implements Context {
  public request : HttpRequest;
  public response : HttpResponse;
  public params : Params;

  constructor(request: HttpRequest, response: HttpResponse, params: Params) {
    this.request = request;
    this.response = response;
    this.params = params;
  }
};
