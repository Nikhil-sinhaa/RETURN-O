import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  organization: z.string().optional(),
});

// Rate limiting (simple in-memory)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Send email to club
    const { data: clubEmail, error: clubError } = await resend.emails.send({
      from: 'RETURN 0; Contact Form <noreply@return0.iiitdwd.ac.in>',
      to: ['return0@iiitdwd.ac.in'],
      replyTo: validatedData.email,
      subject: `[Contact Form] ${validatedData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(157, 78, 221, 0.1)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px;">
                <h1 style="color: #FF006E; margin: 0 0 24px 0; font-size: 24px;">
                  New Contact Form Submission
                </h1>
                
                <div style="margin-bottom: 24px;">
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    From
                  </p>
                  <p style="color: #ffffff; margin: 0; font-size: 16px;">
                    ${validatedData.name}
                  </p>
                </div>
                
                <div style="margin-bottom: 24px;">
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    Email
                  </p>
                  <p style="color: #00F5FF; margin: 0; font-size: 16px;">
                    <a href="mailto:${validatedData.email}" style="color: #00F5FF; text-decoration: none;">
                      ${validatedData.email}
                    </a>
                  </p>
                </div>
                
                ${validatedData.organization ? `
                <div style="margin-bottom: 24px;">
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    Organization
                  </p>
                  <p style="color: #ffffff; margin: 0; font-size: 16px;">
                    ${validatedData.organization}
                  </p>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 24px;">
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    Subject
                  </p>
                  <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">
                    ${validatedData.subject}
                  </p>
                </div>
                
                <div>
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    Message
                  </p>
                  <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px;">
                    <p style="color: rgba(255, 255, 255, 0.8); margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                      ${validatedData.message}
                    </p>
                  </div>
                </div>
              </div>
              
              <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; text-align: center; margin-top: 24px;">
                RETURN 0; — IIIT Dharwad
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (clubError) {
      console.error('Failed to send email to club:', clubError);
      throw new Error('Failed to send message');
    }

    // Send confirmation email to user
    const { error: userError } = await resend.emails.send({
      from: 'RETURN 0; <noreply@return0.iiitdwd.ac.in>',
      to: [validatedData.email],
      subject: 'We received your message — RETURN 0;',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                  RETURN <span style="color: #FF006E;">0</span>;
                </h1>
                <p style="color: rgba(255, 255, 255, 0.5); margin: 8px 0 0 0; font-size: 14px;">
                  Competitive Programming Club — IIIT Dharwad
                </p>
              </div>
              
              <div style="background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(157, 78, 221, 0.1)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px;">
                <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 20px;">
                  Hi ${validatedData.name}! 👋
                </h2>
                
                <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
                  Thank you for reaching out to RETURN 0;! We've received your message and will get back to you within 24-48 hours.
                </p>
                
                <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
                  In the meantime, feel free to explore our website and check out the latest contests!
                </p>
                
                <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                  <p style="color: rgba(255, 255, 255, 0.5); margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    Your Message
                  </p>
                  <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong style="color: rgba(255, 255, 255, 0.8);">${validatedData.subject}</strong>
                  </p>
                </div>
                
                <a href="https://return0.iiitdwd.ac.in/contests" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #9D4EDD); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  View Live Contests →
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0;">
                  © 2025 RETURN 0; — IIIT Dharwad
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (userError) {
      console.error('Failed to send confirmation email:', userError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        id: clubEmail?.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}