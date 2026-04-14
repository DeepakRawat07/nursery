import nodemailer from 'nodemailer';
import env from '../config/env.js';
import ApiError from './ApiError.js';

let transporter = null;
let transporterVerified = false;

export const isEmailDeliveryConfigured = () =>
  Boolean((env.smtpService || env.smtpHost) && env.smtpUser && env.smtpPass && env.smtpFrom);

export const getEmailDeliveryStatus = () => {
  const missing = [];
  const warnings = [];

  if (!env.smtpService && !env.smtpHost) {
    missing.push('SMTP_SERVICE or SMTP_HOST');
  }

  if (!env.smtpUser) {
    missing.push('SMTP_USER');
  }

  if (!env.smtpPass) {
    missing.push('SMTP_PASS');
  }

  if (!env.smtpFrom) {
    missing.push('SMTP_FROM');
  }

  if (!env.smtpService && env.smtpHost && env.smtpPort === 465 && !env.smtpSecure) {
    warnings.push('SMTP_PORT is 465, so SMTP_SECURE was forced to true for the transport.');
  }

  return {
    configured: missing.length === 0,
    mode: env.smtpService ? 'service' : env.smtpHost ? 'host' : 'disabled',
    missing,
    warnings,
    summary: {
      service: env.smtpService || null,
      host: env.smtpHost || null,
      port: env.smtpPort,
      secure: env.smtpService ? null : env.smtpSecure || env.smtpPort === 465,
      user: env.smtpUser || null,
      from: env.smtpFrom || null
    }
  };
};

export const getEmailErrorDetails = (error) => {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  const details = {
    name: error.name,
    message: error.message
  };

  if ('code' in error && error.code) {
    details.code = error.code;
  }

  if ('command' in error && error.command) {
    details.command = error.command;
  }

  if ('responseCode' in error && error.responseCode) {
    details.responseCode = error.responseCode;
  }

  if ('response' in error && error.response) {
    details.response = error.response;
  }

  return details;
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getTransporter = () => {
  if (!isEmailDeliveryConfigured()) {
    throw new ApiError(
      500,
      'Email delivery is not configured. Set SMTP_SERVICE or SMTP_HOST, plus SMTP_USER, SMTP_PASS, and SMTP_FROM.'
    );
  }

  if (!transporter) {
    const transportConfig = env.smtpService
      ? {
          service: env.smtpService,
          auth: {
            user: env.smtpUser,
            pass: env.smtpPass
          }
        }
      : {
          host: env.smtpHost,
          port: env.smtpPort,
          secure: env.smtpSecure || env.smtpPort === 465,
          auth: {
            user: env.smtpUser,
            pass: env.smtpPass
          }
        };

    transporter = nodemailer.createTransport(transportConfig);
  }

  return transporter;
};

export const verifyEmailTransport = async () => {
  const mailer = getTransporter();

  if (!transporterVerified) {
    await mailer.verify();
    transporterVerified = true;
  }

  return mailer;
};

export const sendRegistrationOtpEmail = async ({ email, name, otp, expiresInMinutes }) => {
  const mailer = await verifyEmailTransport();
  const safeName = escapeHtml(name);

  await mailer.sendMail({
    from: env.smtpFrom,
    to: email,
    subject: 'Your Nursery Store verification code',
    text: `Hello ${name}, your verification code is ${otp}. It expires in ${expiresInMinutes} minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;padding:24px">
        <p style="margin:0 0 12px">Hello ${safeName},</p>
        <p style="margin:0 0 18px">Use the verification code below to complete your Nursery Store registration.</p>
        <div style="margin:0 0 18px;padding:16px 20px;border-radius:16px;background:#f5efe4;border:1px solid #d9d0c2;text-align:center">
          <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#5b4435;margin-bottom:8px">Verification code</div>
          <div style="font-size:32px;font-weight:700;letter-spacing:0.28em;color:#214b37">${otp}</div>
        </div>
        <p style="margin:0 0 12px">This code expires in ${expiresInMinutes} minutes.</p>
        <p style="margin:0;color:#64748b;font-size:14px">If you did not request this code, you can ignore this email.</p>
      </div>
    `
  });
};
