import { Resend } from "resend";
import nodemailer from "nodemailer";

/**
 * Palace Professional Email Service
 * 
 * Supports both Nodemailer (Gmail/SMTP) and Resend.
 * For SMTP, configure SMTP_USER and SMTP_PASS in .env.
 * For Resend, configure RESEND_API_KEY in .env.
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize SMTP transporter if credentials are provided
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const smtpSecure = process.env.SMTP_SECURE !== "false"; // default to true

const transporter = smtpUser && smtpPass
  ? nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
  : null;

export async function sendBookingEmail({
  to,
  subject,
  customerName,
  roomName,
  checkIn,
  checkOut,
  status,
  price,
  bookingId
}: {
  to: string | string[],
  subject: string,
  customerName: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
  status: string,
  price?: number,
  bookingId?: string
}) {
  const isApproved = status === "APPROVED" || status === "APPROVED (Manual)";
  const displayBookingId = bookingId || 'PENDING';

  // Generate Google Calendar Link if Approved
  let calendarLinkHtml = "";
  if (isApproved) {
    const startDate = new Date(checkIn).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(checkOut).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const eventParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: `StayNjoy Booking: ${roomName}`,
      dates: `${startDate}/${endDate}`,
      details: `Your royal stay is confirmed! Booking ID: ${displayBookingId}.`,
      location: 'StayNjoy Palace, Tinsukia, Assam',
    });
    const gCalUrl = `https://calendar.google.com/calendar/render?${eventParams.toString()}`;

    calendarLinkHtml = `
      <div style="text-align: center; margin: 25px 0;">
        <a href="${gCalUrl}" target="_blank" style="background-color: #D14D7E; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
          📅 Add to Google Calendar
        </a>
      </div>
    `;
  }


  const emailHtml = `
    <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 20px; background-color: #fff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D14D7E; font-size: 28px; margin: 0;">StayNjoy Palace</h1>
        <p style="color: #B88F54; font-style: italic; margin-top: 5px;">Luxury Awaits You</p>
      </div>
      
      <h2 style="color: #1A0811; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #D14D7E; padding-bottom: 10px;">
        ${isApproved ? 'Booking Confirmed ✨' : 'Reservation Update'}
      </h2>
      
      <p style="color: #4A3B42; font-size: 16px; line-height: 1.6;">
        Dear <strong>${customerName}</strong>,<br><br>
        ${isApproved
      ? `Thank you for your pre-booking payment of ₹300. Your stay at <strong>${roomName}</strong> is now officially confirmed. We look forward to welcoming you to our palace.`
      : `We have received your reservation request for <strong>${roomName}</strong>. Our team is currently reviewing it and awaiting payment confirmation.`}
      </p>
      
      ${calendarLinkHtml}

      <div style="background-color: #FDF4F7; padding: 25px; border-radius: 15px; margin: 30px 0;">
        <h3 style="color: #D14D7E; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Stay Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Booking ID:</strong></td>
            <td style="padding: 8px 0; color: #1A0811; font-family: monospace; font-weight: bold;">${displayBookingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Check-In:</strong></td>
            <td style="padding: 8px 0; color: #1A0811;">${new Date(checkIn).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Check-Out:</strong></td>
            <td style="padding: 8px 0; color: #1A0811;">${new Date(checkOut).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Total Value:</strong></td>
            <td style="padding: 8px 0; color: #D14D7E; font-weight: bold;">₹${price || 'N/A'}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="color: #999; font-size: 12px;">
          Tinsukia, Assam • +91 7002475079 | 8133819414 | 9181042005<br>
          © 2026 StayNjoy Palace. All Rights Reserved.
        </p>
      </div>
    </div>
  `;

  // 1. Try sending via SMTP if configured
  if (transporter && smtpUser) {
    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'StayNjoy Palace'}" <${smtpUser}>`,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: subject,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email successfully sent via SMTP to ${to}. Message ID: ${info.messageId}`);
      return { success: true };
    } catch (error: any) {
      console.error("Nodemailer SMTP Email Error, falling back to Resend if available:", error?.message || error);
    }
  }

  // 2. Fallback to Resend if configured
  if (resend) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const data = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: emailHtml,
      });
      console.log(`Email request sent to Resend for ${to}. ID: ${data.data?.id}`);
      if (data.error) {
        console.error("Resend API returned an error:", data.error);
      } else {
        return { success: true };
      }
    } catch (error: any) {
      console.error("Resend Email Error fallback:", error?.message || error);
    }
  }

  // 3. Last fallback: Log to console
  console.warn("No email transport succeeded. Logging content to console:");
  console.log(`[SUBJECT]: ${subject}`);
  console.log(`[TO]: ${to}`);
  console.log(`[CONTENT]: ${emailHtml.replace(/<[^>]*>/g, '')}`);

  return { success: false };
}

