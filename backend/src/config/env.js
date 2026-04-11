import dotenv from 'dotenv';

dotenv.config();

const smtpPort = Number(process.env.SMTP_PORT || 587);

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/nursery_store',
  jwtSecret: process.env.JWT_SECRET || 'replace-with-a-long-random-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 5242880),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort,
  smtpSecure:
    typeof process.env.SMTP_SECURE === 'string'
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465,
  smtpService: process.env.SMTP_SERVICE || '',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  otpExpiresMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 10)
};

export default env;
