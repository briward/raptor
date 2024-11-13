/**
 * Options which can be used to change kernel functionality.
 */
export interface KernelOptions {
  /**
   * Whether the system should automatically catch errors and respond.
   */
  catchErrors?: boolean;

  /**
   * Whether the system should automatically catch empty response bodies.
   */
  catchEmptyResponses?: boolean;
}
