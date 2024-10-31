// deno-lint-ignore-file

export default function Module (definition: any) {
  return function (target: any, context: any) {
    target.definition = definition;
  };
}
