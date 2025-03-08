import nodemailer from "nodemailer";

export async function POST(request) {
  const { firstName, lastName, email, message } = await request.json();

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail, SendGrid, etc.)
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_EMAIL, // Your email address
      pass: process.env.NEXT_PUBLIC_SMTP_PW, // Your email password or app-specific password
    },
  });

  // Email content with HTML template
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_SMTP_EMAIL, // Sender email
    to: process.env.NEXT_PUBLIC_SMTP_EMAIL, // Receiver email
    subject: `New Contact Form Submission from ${firstName} ${lastName}`, // Email subject
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">${message}</p>
        <p style="color: #777; font-size: 12px;">This email was sent from your contact form.</p>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ message: "Email sent successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send email." }), {
      status: 500,
    });
  }
}
