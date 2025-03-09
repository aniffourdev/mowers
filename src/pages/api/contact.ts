// src/pages/api/contact.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from '@/libs/sendMail'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, message } = req.body;

    try {
      await sendMail({
        email,
        sendTo: process.env.SITE_MAIL_RECIEVER,
        subject: `New Contact Form Submission from ${firstName} ${lastName}`,
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p>Name: ${firstName} ${lastName}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
      });

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
