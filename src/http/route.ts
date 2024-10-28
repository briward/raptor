import type { RouteOptions } from '../interfaces/route-options.ts';

export default class Route {
  options : RouteOptions;
  
  constructor(options: RouteOptions) {
    this.options = {
      ...{
        method: "GET",
      },
      ...options
    };
  }
};
