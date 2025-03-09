'use server';
import nodemailer from 'nodemailer';
import { Liquid } from 'liquid';
import fs from 'fs';
import path from 'path';

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
    // Read the Liquid template file
    const templatePath = path.join(process.cwd(), 'src/app/templates/contactTemplate.liquid');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Render the template with dynamic data
    const html = await engine.parseAndRender(template, { firstName, lastName, email, message });

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
