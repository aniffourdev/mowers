// lib/sendMail.ts
'use server';
import nodemailer from 'nodemailer';
import { Liquid } from 'liquid';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

const engine = new Liquid();

const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        .content { margin-bottom: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://themes.pixelwars.org/impose/wp-content/uploads/2015/12/impose-logo.png" height="80" width="150" alt="Logo">
            <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
            <p><strong>Name:</strong> {{ firstName }} {{ lastName }}</p>
            <p><strong>Email:</strong> {{ email }}</p>
            <p><strong>Message:</strong></p>
            <p>{{ message }}</p>
        </div>
        <div class="footer">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function sendMail({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  try {
    await transporter.verify();
    console.log('SMTP connection verified');
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return;
  }

  try {
    // Render the template with dynamic data
    const html = await engine.parseAndRender(emailTemplate, { firstName, lastName, email, message });

    const info = await transporter.sendMail({
      from: email,
      to: SITE_MAIL_RECIEVER,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
      html: html,
    });

    console.log('Message Sent', info.messageId);
    console.log('Mail sent to', SITE_MAIL_RECIEVER);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
