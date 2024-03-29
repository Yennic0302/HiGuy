declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: number;
      JWT_KEY_WORD: string;
    }
  }
}
export {};
