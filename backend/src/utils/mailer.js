import nodemailer from 'nodemailer';
import env from '../config/env.js';
import ApiError from './ApiError.js';

let transporter = null;

export const isEmailDeliveryConfigured = () =>
  Boolean((env.smtpService || env.smtpHost) && env.smtpUser && env.smtpPass && env.smtpFrom);

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
          secure: env.smtpSecure,
          auth: {
            user: env.smtpUser,
            pass: env.smtpPass
          }
        };

    transporter = nodemailer.createTransport(transportConfig);
  }

  return transporter;
};

export const sendRegistrationOtpEmail = async ({ email, name, otp, expiresInMinutes }) => {
  const mailer = getTransporter();
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
