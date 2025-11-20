declare module '@onamfc/developer-log' {
  const log: {
    info: (message: string, data?: any) => void;
    error: (message: string, error?: any) => void;
    warn: (message: string, data?: any) => void;
    debug: (message: string, data?: any) => void;
  };
  export default log;
}

declare module '@onamfc/pkg-inspect' {
  export function inspect(options: { path: string }): Promise<any>;
}
