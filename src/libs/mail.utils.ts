import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_EMAIL,
    pass: process.env.NEXT_PUBLIC_SMTP_PW,
  },
} as SMTPTransport.Options);

type SendEmailDto = {
  sender: {
    name: string;
    address: string;
  };
  recipients: {
    name: string;
    address: string;
  }[];
  subject: string;
  message: string;
};

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, recipients, subject, message } = dto;
  return await transport.sendMail({
    from: sender,
    to: recipients,
    subject,
    html: message,
  });
};
