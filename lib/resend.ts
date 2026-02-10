// lib/resend.ts
// Resend email service configuration

import { Resend } from 'resend';
import type { ContactFormData } from './types';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'RETURN 0; <noreply@return0.iiitdwd.ac.in>';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'return0@iiitdwd.ac.in';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'return0@iiitdwd.ac.in';

/**
 * Send contact form submission email
 */
export async function sendContactEmail(data: ContactFormData) {
  const { name, email, subject, message, category = 'general' } = data;

  try {
    // Send notification to club email
    const notificationResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[${category.toUpperCase()}] ${subject}`,
      html: generateNotificationEmailHtml({ name, email, subject, message, category }),
      text: generateNotificationEmailText({ name, email, subject, message, category }),
    });

    if (notificationResult.error) {
      console.error('Failed to send notification email:', notificationResult.error);
      throw new Error(notificationResult.error.message);
    }

    // Send confirmation to user
    const confirmationResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: 'Thank you for contacting RETURN 0;',
      html: generateConfirmationEmailHtml({ name, subject: subject || '' }),
      text: generateConfirmationEmailText({ name, subject: subject || '' }),
    });

    if (confirmationResult.error) {
      console.error('Failed to send confirmation email:', confirmationResult.error);
      // Don't throw here - the main email was sent successfully
    }

    return {
      success: true,
      messageId: notificationResult.data?.id,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Generate notification email HTML
 */
function generateNotificationEmailHtml(data: ContactFormData): string {
  const { name, email, subject, message, category } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #FF006E; font-size: 32px; margin: 0; font-weight: bold;">
        RETURN 0;
      </h1>
      <p style="color: #9D4EDD; font-size: 14px; margin-top: 8px;">
        New Contact Form Submission
      </p>
    </div>

    <!-- Content Card -->
    <div style="background: rgba(18, 18, 26, 0.95); border: 1px solid rgba(157, 78, 221, 0.3); border-radius: 16px; padding: 32px;">
      <!-- Category Badge -->
      <div style="margin-bottom: 24px;">
        <span style="background: linear-gradient(135deg, #FF006E, #9D4EDD); color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; text-transform: uppercase; font-weight: 600;">
          ${category}
        </span>
      </div>

      <!-- Subject -->
      <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 24px 0; line-height: 1.3;">
        ${subject}
      </h2>

      <!-- Sender Info -->
      <div style="background: rgba(157, 78, 221, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%;">
          <tr>
            <td style="color: #9D4EDD; font-size: 14px; padding-bottom: 8px;">From:</td>
            <td style="color: #FFFFFF; font-size: 14px; padding-bottom: 8px; text-align: right;">${name}</td>
          </tr>
          <tr>
            <td style="color: #9D4EDD; font-size: 14px;">Email:</td>
            <td style="color: #00F5FF; font-size: 14px; text-align: right;">
              <a href="mailto:${email}" style="color: #00F5FF; text-decoration: none;">${email}</a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Message -->
      <div style="border-left: 3px solid #FF006E; padding-left: 20px;">
        <p style="color: #CCCCCC; font-size: 16px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
          ${message}
        </p>
      </div>

      <!-- Reply Button -->
      <div style="margin-top: 32px; text-align: center;">
        <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #9D4EDD); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #666666; font-size: 12px; margin: 0;">
        This email was sent from the RETURN 0; website contact form.
      </p>
      <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0;">
        © ${new Date().getFullYear()} RETURN 0; - Competitive Programming Club, IIIT Dharwad
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate notification email plain text
 */
function generateNotificationEmailText(data: ContactFormData): string {
  const { name, email, subject, message, category } = data;

  return `
RETURN 0; - New Contact Form Submission
========================================

Category: ${category?.toUpperCase()}
Subject: ${subject}

From: ${name}
Email: ${email}

Message:
--------
${message}

---
Reply to this email to respond to ${name}.

© ${new Date().getFullYear()} RETURN 0; - Competitive Programming Club, IIIT Dharwad
  `.trim();
}

/**
 * Generate confirmation email HTML
 */
function generateConfirmationEmailHtml(data: { name: string; subject: string }): string {
  const { name, subject } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting RETURN 0;</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #FF006E; font-size: 32px; margin: 0; font-weight: bold;">
        RETURN 0;
      </h1>
      <p style="color: #9D4EDD; font-size: 14px; margin-top: 8px;">
        Competitive Programming Club, IIIT Dharwad
      </p>
    </div>

    <!-- Content Card -->
    <div style="background: rgba(18, 18, 26, 0.95); border: 1px solid rgba(157, 78, 221, 0.3); border-radius: 16px; padding: 32px;">
      <!-- Greeting -->
      <h2 style="color: #FFFFFF; font-size: 24px; margin: 0 0 16px 0;">
        Hello ${name}! 👋
      </h2>

      <p style="color: #CCCCCC; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
        Thank you for reaching out to <span style="color: #FF006E; font-weight: bold;">RETURN 0;</span>
      </p>

      <p style="color: #CCCCCC; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
        We have received your message regarding "<strong style="color: #FFFFFF;">${subject}</strong>" and our team will get back to you as soon as possible.
      </p>

      <!-- Info Box -->
      <div style="background: rgba(0, 245, 255, 0.1); border: 1px solid rgba(0, 245, 255, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #00F5FF; font-size: 14px; margin: 0;">
          ⏱️ We typically respond within 24-48 hours during weekdays.
        </p>
      </div>

      <p style="color: #CCCCCC; font-size: 16px; line-height: 1.7; margin: 0;">
        In the meantime, feel free to explore our website or follow us on social media for the latest updates on contests, events, and more!
      </p>

      <!-- Social Links -->
      <div style="margin-top: 32px; text-align: center;">
        <a href="https://github.com/return0-iiitdwd" style="display: inline-block; margin: 0 8px; color: #9D4EDD; text-decoration: none; font-size: 14px;">GitHub</a>
        <span style="color: #444;">•</span>
        <a href="https://linkedin.com/company/return0-iiitdwd" style="display: inline-block; margin: 0 8px; color: #9D4EDD; text-decoration: none; font-size: 14px;">LinkedIn</a>
        <span style="color: #444;">•</span>
        <a href="https://discord.gg/return0" style="display: inline-block; margin: 0 8px; color: #9D4EDD; text-decoration: none; font-size: 14px;">Discord</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="color: #666666; font-size: 12px; margin: 0;">
        This is an automated confirmation email. Please do not reply directly to this email.
      </p>
      <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0;">
        © ${new Date().getFullYear()} RETURN 0; - IIIT Dharwad
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate confirmation email plain text
 */
function generateConfirmationEmailText(data: { name: string; subject: string }): string {
  const { name, subject } = data;

  return `
Hello ${name}!

Thank you for reaching out to RETURN 0;

We have received your message regarding "${subject}" and our team will get back to you as soon as possible.

We typically respond within 24-48 hours during weekdays.

In the meantime, feel free to explore our website or follow us on social media for the latest updates on contests, events, and more!

- GitHub: https://github.com/return0-iiitdwd
- LinkedIn: https://linkedin.com/company/return0-iiitdwd
- Discord: https://discord.gg/return0

---
This is an automated confirmation email. Please do not reply directly to this email.

© ${new Date().getFullYear()} RETURN 0; - Competitive Programming Club, IIIT Dharwad
  `.trim();
}

/**
 * Verify Resend API connection
 */
export async function verifyResendConnection(): Promise<boolean> {
  try {
    // Try to list emails to verify connection
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      subject: 'RETURN 0; - Email Service Verification',
      text: 'This is a test email to verify the Resend connection.',
    });

    return !result.error;
  } catch {
    return false;
  }
}

export { resend };