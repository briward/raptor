import { Params } from "@amber/interfaces/context.ts";

export default class ParamParser {
  public pattern : URLPattern;
  public url : string;

  constructor(pattern: URLPattern, url: string) {
    this.pattern = pattern;
    this.url = url;
  }

  public parse(): Params {
    const segments : Array<string> = [];

    const regexPattern = this.pattern.pathname.replace(/\/:([^\/]+)/g, (match, name) => {
      segments.push(name);

      return '/([^/]+)';
    });

    const regex = new RegExp(`^${regexPattern}$`);

    const url = new URL(this.url);

    const match = url.pathname.match(regex);

    if (!match) return {};

    const params : Params = {};

    segments.forEach((name, index) => {
      const value = match[index + 1];
      params[name] = value;
    });

    return params;
  }
};
