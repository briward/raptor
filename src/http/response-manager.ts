// deno-lint-ignore-file no-explicit-any

import type Context from "./context.ts";
import type HttpResponse from "./response.ts";
import JsonProcessor from "./processors/json.ts";
import HtmlProcessor from "./processors/html.ts";
import type { Processor } from "./interfaces/processor.ts";
import PlainTextProcessor from "./processors/plain-text.ts";

/**
 * The response manager takes the response body and processes it
 * into a valid HTTP response.
 */
export default class ResponseManager {
  /**
   * All available response processors.
   */
  private processors: Processor[] = [];

  /**
   * Initialise the HTTP processor.
   *
   * @constructor
   */
  constructor() {
    this.processors = [
      new PlainTextProcessor(),
      new HtmlProcessor(),
      new JsonProcessor(),
    ];
  }

  /**
   * Add a new processor to the response manager.
   *
   * @param processor An implementation of a response processor.
   * @param weight An optional weight to order the processor in the stack.
   * @returns void
   */
  public addProcessor(processor: Processor, weight: number = 0): void {
    this.processors.splice(weight, 0, processor);
  }

  /**
   * Process a body into a valid Response object.
   *
   * @param body A body value to process.
   * @param context The current HTTP context.
   * @returns A valid HTTP response object.
   */
  public async process(body: any, context: Context): Promise<HttpResponse | null> {  
    // Run through each processor and attempt to process response.
    for (let i = 0; i < this.processors.length; i++) {
      const response = await this.processors[i].process(body, context);

      if (!response) continue;

      return response;
    }

    return null;
  }
}
