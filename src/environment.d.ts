declare global {
  // biome-ignore lint/style/noNamespace: NodeJS ProcessEnv augmentation uses namespace merging.
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      NEXT_PUBLIC_SERVER_URL: string;
      PAYLOAD_SECRET: string;
      VERCEL_PROJECT_PRODUCTION_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
