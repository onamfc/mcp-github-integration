import log from '@onamfc/developer-log';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, data?: any): void {
    log.info(`[${this.context}] ${message}`, data);
  }

  error(message: string, error?: any): void {
    log.error(`[${this.context}] ${message}`, error);
  }

  warn(message: string, data?: any): void {
    log.warn(`[${this.context}] ${message}`, data);
  }

  debug(message: string, data?: any): void {
    log.debug(`[${this.context}] ${message}`, data);
  }
}
