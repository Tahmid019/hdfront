const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";

export const logger = {
  log: (...args: unknown[]) => { if (DEBUG) console.log(...args); },
  warn: (...args: unknown[]) => { if (DEBUG) console.warn(...args); },
  error: (...args: unknown[]) => { if (DEBUG) console.error(...args); },
};