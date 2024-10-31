import { container, type DependencyContainer } from "npm:tsyringe@^4.8.0";

export default abstract class ServiceProvider {
  public container : DependencyContainer;

  constructor() {
    this.container = container;
  }

  public register() {
    //
  }
}
