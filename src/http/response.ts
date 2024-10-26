export default class HttpResponse extends Response {
  #status: number;
  #body: ReadableStream<Uint8Array>;
  #headers: Headers;

  constructor(body: BodyInit | null, init?: ResponseInit) {
    super(body, init);

    this.#status = 200;
    this.#body = new ReadableStream();
    this.#headers = new Headers();
  }

  override get status() {
    return this.#status;
  }

  override set status(value: number) {
    this.#status = value;
  }

  override get body() {
    return this.#body;
  }

  override set body(value: any) {
    this.#body = value;
  }

  override get headers() {
    return this.#headers;
  }

  override set headers(value: Headers) {
    this.#headers = value;
  }
};
