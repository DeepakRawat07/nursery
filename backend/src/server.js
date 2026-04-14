import app from './app.js';
import { ensurePendingRegistrationsTable } from './config/bootstrap.js';
import db from './config/db.js';
import env from './config/env.js';
import { getEmailDeliveryStatus, verifyEmailTransport } from './utils/mailer.js';

let server = null;

const start = async () => {
  await ensurePendingRegistrationsTable();
  const emailStatus = getEmailDeliveryStatus();

  if (!emailStatus.configured) {
    console.warn('Email delivery is disabled.', {
      missing: emailStatus.missing
    });
  } else {
    if (emailStatus.warnings.length > 0) {
      console.warn('Email delivery configuration warnings detected.', {
        warnings: emailStatus.warnings
      });
    }

    try {
      await verifyEmailTransport();
      console.info('Email delivery transport verified.', emailStatus.summary);
    } catch (error) {
      console.error('Email delivery transport verification failed.', {
        ...emailStatus.summary,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

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
