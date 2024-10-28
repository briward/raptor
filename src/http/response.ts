import { Buffer } from "node:buffer";
import type { URLSearchParams } from "node:url";

type ResponseBody =
  | string
  | object
  | Blob
  | ArrayBuffer
  | DataView
  | FormData
  | ReadableStream
  | URLSearchParams;

export default class HttpResponse extends Response {
  #status: number;
  #headers: Headers;
  #body: ReadableStream<Uint8Array> | null;

  constructor(body: BodyInit | null, init?: ResponseInit) {
    super(body, init);

    this.#status = 200;
    this.#body = null;
    this.#headers = new Headers();
  }

  override get status(): number {
    return this.#status;
  }

  override set status(value: number) {
    this.#status = value;
  }

  override get body(): ReadableStream<Uint8Array> | null {
    return this.#body;
  }

  override set body(value: ResponseBody) {
    if (typeof value === "object") {
      this.headers.set("content-type", "application/json");

      value = JSON.stringify(value);
    }

    const buffer = Buffer.from(value);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(buffer);
        controller.close();
      },
    });

    this.#body = stream;
  }

  override get headers(): Headers {
    return this.#headers;
  }

  override set headers(value: Headers) {
    this.#headers = value;
  }

  public async hasBody(): Promise<boolean> {
    const hasBody = await this.body;

    return !!hasBody;
  }
}
