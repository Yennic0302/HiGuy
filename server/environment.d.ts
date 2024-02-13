declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: number;
      URL_MONGODB: string;
      JWT_KEY_WORD: string;
      ZEGO_APP_ID: number;
      ZEGO_SERVER_ID: string;
    }
  }
}
export {};
