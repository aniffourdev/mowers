// src/pages/api/contact.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from '@/libs/sendMail'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, message } = req.body;

    try {
      await sendMail({ firstName, lastName, email, message });
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Not Sent!' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
