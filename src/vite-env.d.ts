/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "false" to disable MSW and hit the real backend via the dev proxy. */
  readonly VITE_USE_MSW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
