import { container, type DependencyContainer } from "npm:tsyringe@^4.8.0";

/**
 * A service provider is the core mechanism for adding
 * functionality to Raptor.
 */
export default abstract class ServiceProvider {
  /**
   * The dependency injection container.
   */
  public container: DependencyContainer;

  /**
   * Instantiates a new service provider.
   *
   * @constructor
   */
  constructor() {
    this.container = container;
  }

  /**
   * Register any container bindings with the kernel.
   */
  public register(): void {
    //
  }
}
