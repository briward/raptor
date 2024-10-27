import type { AnyObject, ObjectSchema } from "npm:yup@1.4.0";

import RequestValidator, { type ValidationResponse } from "./request-validator.ts";

export default class HttpRequest extends Request {
  private validator : RequestValidator;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);

    this.validator = new RequestValidator();
  }

  public async validate(schema: ObjectSchema<AnyObject>) : ValidationResponse {
    const body = await this.json();

    return this.validator.validate(body, schema);
  }
};
