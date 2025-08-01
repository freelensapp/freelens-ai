import log from "loglevel";
import { useMemo } from "react";

const isProd = import.meta.env.VITE_ENV == "production";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface Logger {
  debug: (message: string, ...meta: any[]) => void;
  info: (message: string, ...meta: any[]) => void;
  warn: (message: string, ...meta: any[]) => void;
  error: (message: string, ...meta: any[]) => void;
}

const useLog = (scope = "default") => {
  const _logger = useMemo(() => {
    const _logger = log.getLogger("base");
    _logger.setLevel(isProd ? LogLevel.WARN : LogLevel.DEBUG);
    return _logger;
  }, []);

  const logger: Logger = useMemo(
    () => ({
      debug: (msg: string, ...meta: any[]) => _logger.debug(`[${scope}] ${msg}`, ...meta),
      info: (msg: string, ...meta: any[]) => _logger.info(`[${scope}] ${msg}`, ...meta),
      warn: (msg: string, ...meta: any[]) => _logger.warn(`[${scope}] ${msg}`, ...meta),
      error: (msg: string, ...meta: any[]) => _logger.error(`[${scope}] ${msg}`, ...meta),
    }),
    [scope],
  );

  const setLogLevel = (level: LogLevel) => {
    _logger.setLevel(level);
  };

  return { log: logger, setLogLevel };
};

export default useLog;
