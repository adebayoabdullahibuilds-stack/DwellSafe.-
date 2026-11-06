import type { Environment } from './environment';

export function validateEnvironment(config: Record<string, unknown>): Environment {
  const nodeEnv = String(config.NODE_ENV ?? 'development');
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }

  const port = Number(config.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const databaseUrl = String(config.DATABASE_URL ?? '');
  if (!databaseUrl) throw new Error('DATABASE_URL is required.');
  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }
  if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the postgres or postgresql protocol.');
  }

  const originsValue = String(config.FRONTEND_ORIGINS ?? 'http://localhost:5173');
  const origins = originsValue.split(',').map((origin) => origin.trim()).filter(Boolean);
  for (const origin of origins) {
    try {
      const parsedOrigin = new URL(origin);
      if (!['http:', 'https:'].includes(parsedOrigin.protocol) || parsedOrigin.origin !== origin) {
        throw new Error();
      }
    } catch {
      throw new Error('FRONTEND_ORIGINS must be a comma-separated list of valid origins.');
    }
  }

  return {
    NODE_ENV: nodeEnv as Environment['NODE_ENV'],
    PORT: port,
    DATABASE_URL: databaseUrl,
    FRONTEND_ORIGINS: origins,
  };
}
