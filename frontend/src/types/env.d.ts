interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  readonly NG_APP_PRODUCTION: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}