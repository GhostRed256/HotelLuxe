import { Resend } from "resend";
import nodemailer from "nodemailer";

/**
 * StayNJoy Professional Email Service
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
const smtpSecure = smtpPort === 465 || process.env.SMTP_SECURE === "true" && smtpPort !== 587; // strict check to prevent OpenSSL version errors on 587

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
  bookingId,
  upiTxnId,
  paymentScreenshot,
  paymentStatus
}: {
  to: string | string[],
  subject: string,
  customerName: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
  status: string,
  price?: number,
  bookingId?: string,
  upiTxnId?: string,
  paymentScreenshot?: string,
  paymentStatus?: "PAID" | "PENDING" | "MANUAL"
}) {
  const isApproved = status === "APPROVED" || status === "APPROVED (Manual)";
  const isAdminReview = status === "PENDING_OWNER_REVIEW";
  const displayBookingId = bookingId || 'PENDING';

  // Base URL resolution for deployment and local testing
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` :
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));

  // Generate Google Calendar Link if Approved
  let calendarLinkHtml = "";
  if (isApproved) {
    const startDate = new Date(checkIn).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(checkOut).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const eventParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: `StayNJoy Booking: ${roomName}`,
      dates: `${startDate}/${endDate}`,
      details: `Your stay is confirmed! Booking ID: ${displayBookingId}.`,
      location: 'StayNJoy Homestay, Tinsukia, Assam',
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
        <h1 style="color: #FF2D55; font-size: 28px; margin: 0;">Stay<span style="color: #B88F54; font-style: italic;">N</span>Joy Homestay</h1>
        <p style="color: #B88F54; font-style: italic; margin-top: 5px;">A Legacy of Palatial Warmth</p>
      </div>
      
      <h2 style="color: #1A0811; font-size: 22px; margin-bottom: 20px; border-bottom: 2px solid #D14D7E; padding-bottom: 10px;">
        ${isApproved ? 'Booking Confirmed ✨' : 'Reservation Update'}
      </h2>
      
      <p style="color: #4A3B42; font-size: 16px; line-height: 1.6;">
        Dear <strong>${isAdminReview ? 'Admin' : customerName}</strong>,<br><br>
        ${isAdminReview
      ? (paymentStatus === "MANUAL"
        ? `A manual booking has been recorded for <strong>${roomName}</strong>. This was added directly by the administrator.`
        : paymentStatus === "PENDING"
          ? `A new booking request has been received for <strong>${roomName}</strong>. The guest has opted for <strong>Manual/Offline verification</strong>. Please verify the payment before authorizing.`
          : `A new booking request has been received for <strong>${roomName}</strong>. The guest has provided a ₹300 booking fee via UPI. <strong>Please verify the payment in your bank account before authorizing the stay.</strong>`)
      : isApproved
        ? `Great news! Your stay at <strong>${roomName}</strong> is now officially confirmed. We look forward to welcoming you to our homestay.`
        : `We have received your reservation request for <strong>${roomName}</strong>. Our team is currently reviewing your details. You will receive a final confirmation email shortly. <strong>Please pay the booking fee of ₹300 to confirm the stay so we can authorize your booking.</strong>`}
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

        ${(upiTxnId || paymentScreenshot) ? `
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(209, 77, 126, 0.1);">
            <h4 style="color: #D14D7E; margin-top: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Payment Proof</h4>
            ${upiTxnId ? `<p style="margin: 5px 0; font-size: 14px; color: #4A3B42;"><strong>Transaction ID:</strong> <span style="font-family: monospace;">${upiTxnId}</span></p>` : ""}
            ${paymentScreenshot ? `
              <p style="margin: 10px 0;">
                <a href="${paymentScreenshot}" style="color: #D14D7E; font-size: 13px; font-weight: bold; text-decoration: underline;">View Uploaded Screenshot Proof</a>
              </p>
            ` : ""}
          </div>
        ` : ""}
      </div>

      ${isAdminReview ? `
        <div style="text-align: center; margin: 30px 0; padding-top: 20px; border-top: 1px dashed #eee;">
          <h4 style="margin-bottom: 20px; color: #1A0811;">Admin Dashboard Actions</h4>
          <a href="${baseUrl}/admin?bookingId=${displayBookingId}" target="_blank" style="background-color: #10B981; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; margin-right: 15px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
            ✅ Accept Request
          </a>
          <a href="${baseUrl}/admin?bookingId=${displayBookingId}" target="_blank" style="background-color: #EF4444; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);">
            ❌ Reject Request
          </a>
          <p style="color: #999; font-size: 11px; margin-top: 15px; font-style: italic;">
            Clicking these buttons will take you to the Staff Panel to process the reservation.
          </p>
        </div>
      ` : ""}
      
      <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="color: #999; font-size: 12px;">
          Tinsukia, Assam • +91 7002475079 | 8133819414 | 9181042005<br>
          © 2026 StayNJoy Homestay. All Rights Reserved.
        </p>
      </div>
    </div>
  `;

  // Attachment handling
  const attachments: any[] = [];
  if (paymentScreenshot && paymentScreenshot.includes("base64,")) {
    try {
      const parts = paymentScreenshot.split("base64,");
      const mimeMatch = parts[0].match(/data:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const base64Data = parts[1];
      const extension = mimeType.split("/")[1] || "jpg";

      attachments.push({
        filename: `payment_proof_${displayBookingId}.${extension}`,
        content: Buffer.from(base64Data, "base64"),
        contentType: mimeType,
      });
    } catch (e) {
      console.error("Error creating email attachment:", e);
    }
  }

  // 1. Try sending via SMTP if configured
  if (transporter && smtpUser) {
    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'StayNJoy Homestay'}" <${smtpUser}>`,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: subject,
        html: emailHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
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
        attachments: attachments.length > 0 ? attachments.map(a => ({
          filename: a.filename,
          content: a.content,
        })) : undefined,
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

