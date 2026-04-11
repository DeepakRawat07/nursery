import app from './app.js';
import { ensurePendingRegistrationsTable } from './config/bootstrap.js';
import db from './config/db.js';
import env from './config/env.js';

let server = null;

const start = async () => {
  await ensurePendingRegistrationsTable();

  server = app.listen(env.port, () => {
    console.log(`Nursery backend listening on port ${env.port}`);
  });
};

const shutdown = async () => {
  if (!server) {
    await db.end();
    process.exit(0);
    return;
  }

  server.close(async () => {
    await db.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection', error);
});

start().catch(async (error) => {
  console.error('Failed to start backend', error);
  await db.end();
  process.exit(1);
});
