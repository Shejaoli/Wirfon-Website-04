import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendContactEmail(opts: {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  phone?: string;
}) {
  const transport = getTransport();
  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

  if (!transport || !to) return false;

  const html = `
    <p><strong>Name:</strong> ${opts.fromName}</p>
    <p><strong>Email:</strong> ${opts.fromEmail}</p>
    ${opts.phone ? `<p><strong>Phone:</strong> ${opts.phone}</p>` : ""}
    <p><strong>Subject:</strong> ${opts.subject}</p>
    <hr />
    <p>${opts.message.replace(/\n/g, "<br>")}</p>
  `;

  await transport.sendMail({
    from: `"${opts.fromName}" <${process.env.SMTP_USER}>`,
    replyTo: opts.fromEmail,
    to,
    subject: `[WirfonCloud Contact] ${opts.subject}`,
    html,
    text: `Name: ${opts.fromName}\nEmail: ${opts.fromEmail}\n${opts.phone ? `Phone: ${opts.phone}\n` : ""}Subject: ${opts.subject}\n\n${opts.message}`,
  });

  return true;
}
