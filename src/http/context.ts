/**
 * The context definition.
 */
export default class Context implements Context {
  /**
   * Initialise an HTTP context.
   *
   * @constructor
   */
  constructor(public request: Request, public response: Response) {}
}
