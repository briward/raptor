/**
 * The base HTTP response for Raptor.
 */
export default class HttpResponse extends Response {
  /**
   * The HTTP status code.
   */
  #status: number = 200;

  #body: any;

  /**
   * Get the HTTP status code.
   */
  override get status(): number {
    return this.#status;
  }

  /**
   * Set the HTTP status code.
   */
  override set status(status: number) {
    this.#status = status;
  }

  /**
   * Get the HTTP status code.
   */
  override get body(): any {
    return this.#body;
  }

  /**
   * Set the HTTP status code.
   */
  override set body(body: any) {
    this.#body = body;
  }

  override clone(): HttpResponse {
    return this;
  }
}
