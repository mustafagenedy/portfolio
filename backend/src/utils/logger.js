/** Minimal logger — replace with pino/winston in production if needed. */
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => isDev && console.log('[DEBUG]', ...args),
};
