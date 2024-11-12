// deno-lint-ignore-file no-explicit-any

import type Context from "./context.ts";
import HttpResponse from "./response.ts";
import JsonProcessor from "./processors/json.ts";
import HtmlProcessor from "./processors/html.ts";
import type Processor from "./interfaces/processor.ts";
import PlainTextProcessor from "./processors/plain-text.ts";

export default class ResponseManager {
  /**
   * All available response processors.
   */
  private processors : Processor[] = [];

  /**
   * Initialise the HTTP processor.
   *
   * @param context The current HTTP context.
   * @constructor
   */
  constructor(private context: Context) {
    this.processors = [
      new PlainTextProcessor,
      new HtmlProcessor,
      new JsonProcessor,
    ];
  }

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @returns A valid HTTP response object.
   */
  public process(body: any): HttpResponse {
    let response = null;

    // Run through each processor and attempt to process response.
    for (let i = 0; i < this.processors.length; i++) {
      response = this.processors[i].process(body, this.context);

      if (response) {
        return response;
      }
    }

    // No response could be processed, fallback.
    if (!response) {
      return new HttpResponse(body as string, {
        status: this.context.response.status,
        headers: this.context.response.headers,
      });
    }

    return response;
  }
}
