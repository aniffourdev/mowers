// types/liquid.d.ts
declare module 'liquid' {
    export class Liquid {
      constructor();
      parseAndRender(template: string, context: object): Promise<string>;
    }
  }
  