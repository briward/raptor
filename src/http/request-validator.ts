// deno-lint-ignore-file no-explicit-any

import type { AnyObject, ObjectSchema } from "npm:yup@1.4.0";

import BadRequest from "../error/bad-request.ts";

/**
 * The response type from validation.
 */
export type ValidationResponse = Promise<{
  [x: string]: any;
  [x: number]: any;
}>;

/**
 * The validator which is attached to the request.
 */
export default class RequestValidator {
  public validate(
    data: object,
    schema: ObjectSchema<AnyObject>,
  ): ValidationResponse | BadRequest {
    try {
      return schema.validate(data);
    } catch (error) {
      throw new BadRequest((error as AnyObject).errors);
    }
  }
}
