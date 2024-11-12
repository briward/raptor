/**
 * The base HTTP response for Raptor.
 */
export default class HttpResponse extends Response {
  /**
   * The HTTP status code.
   */
  #status: number = 200;

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
   * Clone the current HTTP response.
   *
   * @returns A cloned HTTP response.
   */
  override clone(): HttpResponse {
    return this;
  }
}
