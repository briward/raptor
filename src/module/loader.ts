import { walkSync } from "jsr:@std/fs@1.0.5/walk";

import type { Route } from "@amber/interfaces/route.ts";
import type { ModuleConfig } from "@amber/interfaces/module.ts";

export default class Loader {
  private configNamePattern = '\'*.module.ts';

  public async loadModules() : Promise<ModuleConfig[]> {
    const modules = [];

    const files = walkSync(Deno.cwd(), {
      match: [
        new RegExp(this.configNamePattern)
      ]
    });

    for (const file of files) {
      const config = await import(file.path);
      
      modules.push(config.default);
    }

    return modules;
  }

  public async loadRoutes() : Promise<Route[]> {
    const modules = await this.loadModules();

    const routes =  modules.map((module) => {
      if (!module) return [];

      return module.routes;
    });

    return routes.flat();
  }
};
