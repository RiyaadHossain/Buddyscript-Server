import configs from "@/configs/index.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: configs.SMTP_HOST,
  port: Number(configs.SMTP_PORT),
  secure: true, 
  auth: {
    user: configs.SMTP_USER,
    pass: configs.SMTP_PASS,
  },
});

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: configs.MAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Email could not be sent");
  }
}
