import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple in-memory rate limiter
const rateLimit = new Map<string, number>();
const RATE_LIMIT_DURATION = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 3; // Max 3 requests per minute per IP

// --- CONFIGURATION ---
// You can hardcode your details here if you prefer, but Environment Variables are recommended.
// Example for Gmail:
// host: 'smtp.gmail.com', port: 465, secure: true
const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'YOUR_SMTP_HOST', // e.g., smtp.gmail.com
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true' || true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'YOUR_EMAIL@gmail.com',
        pass: process.env.SMTP_PASS || 'YOUR_APP_PASSWORD',
    },
};

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'support@daeyeon.com';
// ---------------------

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // 1. Rate Limiting Check
        const now = Date.now();
        const userLog = rateLimit.get(ip);
        if (userLog && now - userLog < RATE_LIMIT_DURATION) {
            // Basic implementation: if requested too recently, block. 
            // Ideally we'd count requests, but a simple throttle is effective for now.
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }
        rateLimit.set(ip, now);

        const body = await request.json();
        const { name, email, subject, message, company_website } = body;

        // 2. Honeypot Check
        // If the hidden field 'company_website' is filled, it's likely a bot.
        if (company_website) {
            console.log('Bot detected via honeypot');
            // Return success to fool the bot, but don't send email
            return NextResponse.json({ success: true });
        }

        // 3. Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 4. Send Email
        const transporter = nodemailer.createTransport(SMTP_CONFIG);

        const mailOptions = {
            from: `"${name}" <${SMTP_CONFIG.auth.user}>`, // Sender address (often must match auth user)
            replyTo: email, // Valid reply-to address
            to: RECIPIENT_EMAIL,
            subject: `[웹사이트 문의] ${subject}`,
            text: `
이름: ${name}
이메일: ${email}
제목: ${subject}

문의 내용:
${message}
            `,
            html: `
<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
    <h2 style="color: #333;">새로운 문의가 접수되었습니다.</h2>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p><strong>이름:</strong> ${name}</p>
    <p><strong>이메일:</strong> ${email}</p>
    <p><strong>제목:</strong> ${subject}</p>
    <br/>
    <p><strong>문의 내용:</strong></p>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
        ${message.replace(/\n/g, '<br>')}
    </div>
</div>
            `,
        };

        await transporter.verify(); // Verify connection config
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Email send error:', error);
        return NextResponse.json(
            { error: 'Failed to send email. Please try again later.' },
            { status: 500 }
        );
    }
}
