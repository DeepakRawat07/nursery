import express from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import db from './config/db.js';
import env from './config/env.js';
import { attachDatabase } from './middleware/auth.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import router from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(attachDatabase(db));
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

export default app;
