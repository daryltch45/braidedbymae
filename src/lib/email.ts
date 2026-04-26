import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";

// Booking type from Prisma (keep simple to avoid circular imports)
interface BookingWithService {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  preferredDate: Date;
  preferredTime: string;
  location: string;
  travelCity?: string | null;
  paymentMethod: string;
  service: {
    nameFr: string;
    nameEn: string;
    nameDe: string;
    priceMin: number;
    priceMax: number;
  };
}

const isDev = process.env.NODE_ENV !== "production";

// Nodemailer transporter for dev (Mailpit)
const devTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  auth: undefined,
});

// Resend for production
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mae@braidedbymae.com";
const FROM = "BraidedByMae <noreply@braidedbymae.com>";

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function bookingPendingHtml(booking: BookingWithService): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Demande de réservation reçue</title>
</head>
<body style="font-family: Georgia, serif; background: #FFF0F5; color: #1A1A1A; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: #D4839B; padding: 32px; text-align: center;">
      <h1 style="color: white; font-size: 28px; margin: 0; letter-spacing: 1px;">BraidedByMae</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Artiste coiffeuse africaine à Nuremberg</p>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #D4839B; font-size: 22px; margin: 0 0 8px;">Demande reçue ✨</h2>
      <p style="color: #6B6B6B; margin: 0 0 32px; font-size: 15px;">
        Bonjour <strong>${booking.clientName}</strong>, votre demande de réservation a bien été reçue.
        Mae la contactera dans les plus brefs délais pour confirmer le rendez-vous.
      </p>

      <div style="background: #FFF0F5; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #1A1A1A; font-size: 16px; margin: 0 0 16px; border-bottom: 1px solid #D4839B; padding-bottom: 8px;">
          Détails de votre demande
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #6B6B6B; font-size: 14px; width: 40%;">Service</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${booking.service.nameFr}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Date souhaitée</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${formatDate(booking.preferredDate)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Heure souhaitée</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${booking.preferredTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Prix estimé</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${booking.service.priceMin}€ – ${booking.service.priceMax}€</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Lieu</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">
              ${booking.location === "TRAVEL" ? `Déplacement — ${booking.travelCity}` : "À domicile (Nuremberg)"}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Paiement</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${booking.paymentMethod === "ONLINE" ? "En ligne" : "Espèces"}</td>
          </tr>
        </table>
      </div>

      <p style="color: #6B6B6B; font-size: 13px; margin: 0;">
        Si vous avez des questions, contactez-nous via Instagram <a href="https://www.instagram.com/mae_braided/" style="color: #D4839B;">@mae_braided</a>
      </p>
    </div>
    <div style="background: #1A1A1A; padding: 20px 32px; text-align: center;">
      <p style="color: #6B6B6B; font-size: 12px; margin: 0;">
        © 2026 BraidedByMae · Nuremberg, Fürth, Erlangen, Bamberg
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function adminNotificationHtml(booking: BookingWithService): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><title>Nouvelle réservation</title></head>
<body style="font-family: sans-serif; padding: 32px; color: #1A1A1A;">
  <h2 style="color: #D4839B;">Nouvelle demande de réservation</h2>
  <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Client</td><td><strong>${booking.clientName}</strong></td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Email</td><td>${booking.clientEmail}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Téléphone</td><td>${booking.clientPhone || "—"}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Service</td><td>${booking.service.nameFr}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Date</td><td>${formatDate(booking.preferredDate)}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Heure</td><td>${booking.preferredTime}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Lieu</td><td>${booking.location === "TRAVEL" ? `Déplacement — ${booking.travelCity}` : "Domicile"}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #6B6B6B;">Paiement</td><td>${booking.paymentMethod}</td></tr>
  </table>
  <p style="margin-top: 24px; color: #6B6B6B; font-size: 13px;">ID: ${booking.id}</p>
</body>
</html>
  `.trim();
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (isDev) {
    await devTransporter.sendMail({ from: FROM, to, subject, html });
  } else {
    if (!resend) throw new Error("RESEND_API_KEY not set");
    await resend.emails.send({ from: FROM, to, subject, html });
  }
}

export async function sendBookingStatusEmail(
  booking: BookingWithService,
  status: "CONFIRMED" | "REJECTED"
) {
  const isConfirmed = status === "CONFIRMED";
  const subject = isConfirmed
    ? `BraidedByMae — Votre réservation est confirmée ! 🎉`
    : `BraidedByMae — Mise à jour de votre réservation`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="font-family: Georgia, serif; background: #FFF0F5; color: #1A1A1A; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="background: ${isConfirmed ? "#D4839B" : "#8B0000"}; padding: 32px; text-align: center;">
      <h1 style="color: white; font-size: 28px; margin: 0;">BraidedByMae</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Artiste coiffeuse africaine à Nuremberg</p>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: ${isConfirmed ? "#D4839B" : "#8B0000"}; font-size: 22px; margin: 0 0 8px;">
        ${isConfirmed ? "Rendez-vous confirmé ! ✨" : "Demande non disponible"}
      </h2>
      <p style="color: #6B6B6B; margin: 0 0 24px;">
        Bonjour <strong>${booking.clientName}</strong>,
        ${isConfirmed
          ? " votre rendez-vous est confirmé. Mae vous attend avec impatience !"
          : " malheureusement Mae n'est pas disponible à ce créneau. Nous vous invitons à choisir une autre date."}
      </p>
      <div style="background: #FFF0F5; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6B6B6B; font-size: 14px; width: 40%;">Service</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${booking.service.nameFr}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Date</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${formatDate(booking.preferredDate)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B6B6B; font-size: 14px;">Heure</td><td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${booking.preferredTime}</td></tr>
        </table>
      </div>
      <p style="color: #6B6B6B; font-size: 13px; margin: 0;">
        Questions ? Instagram <a href="https://www.instagram.com/mae_braided/" style="color: #D4839B;">@mae_braided</a>
      </p>
    </div>
    <div style="background: #1A1A1A; padding: 20px 32px; text-align: center;">
      <p style="color: #6B6B6B; font-size: 12px; margin: 0;">© 2026 BraidedByMae · Nuremberg, Fürth, Erlangen, Bamberg</p>
    </div>
  </div>
</body>
</html>`.trim();

  await sendEmail({ to: booking.clientEmail, subject, html });
}

export async function sendBookingPendingEmail(booking: BookingWithService) {
  // Email to client
  await sendEmail({
    to: booking.clientEmail,
    subject: "BraidedByMae — Demande de réservation reçue",
    html: bookingPendingHtml(booking),
  });

  // Notification to Mae
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle réservation — ${booking.service.nameFr} — ${booking.clientName}`,
    html: adminNotificationHtml(booking),
  });
}
