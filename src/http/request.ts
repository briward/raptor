import type { AnyObject, ObjectSchema } from "npm:yup@1.4.0";

import RequestValidator, {
  type ValidationResponse,
} from "./request-validator.ts";

/**
 * The HTTP request wrapper.
 */
export default class HttpRequest extends Request {
  /**
   * The validator which will be attached to the request.
   */
  private validator: RequestValidator;

  /**
   * Initialise an HTTP request.
   *
   * @constructor
   * @param input The current request input.
   * @param init Any initialising properties.
   */
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);

    this.validator = new RequestValidator();
  }

  /**
   * Validate the current request body.
   *
   * @param schema The schema to validate against.
   * @returns A validation response object.
   */
  public async validate(schema: ObjectSchema<AnyObject>): ValidationResponse {
    const body = await this.json();

    return this.validator.validate(body, schema);
  }
}
