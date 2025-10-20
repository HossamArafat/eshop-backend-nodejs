import nodemailer from "nodemailer";
// steps to send email
// 1- create transporter | service (gmail, mailgun, sendGrid,..) => which send email
// 2- define email options (to, from, subject, text,..)
// 3- send email

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // use TLS
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOpts = {
    from: `E-Shope App <${process.env.MAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  }

  await transporter.sendMail(mailOpts)
};

export default sendEmail;
