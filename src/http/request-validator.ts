import { ObjectSchema, type AnyObject } from 'npm:yup';

import BadRequest from "@amber/error/bad-request.ts";

export default class RequestValidator {
  public validate(data: object, schema: ObjectSchema<AnyObject>) {
    try {
      return schema.validate(data);
    } catch (error) {
      throw new BadRequest((error as AnyObject).errors);
    }
  }
};
