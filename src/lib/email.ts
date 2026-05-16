import { Resend } from "resend";

/**
 * Palace Professional Email Service
 * 
 * REQUIRED: Add RESEND_API_KEY to your .env file
 * Get your key at: https://resend.com
 */

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendBookingEmail({ 
  to, 
  subject, 
  customerName, 
  roomName, 
  checkIn, 
  checkOut, 
  status,
  price
}: {
  to: string | string[],
  subject: string,
  customerName: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
  status: string,
  price?: number
}) {
  const isApproved = status === "APPROVED" || status === "APPROVED (Manual)";
  
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
          ? `Your stay at <strong>${roomName}</strong> is now officially confirmed. We look forward to welcoming you to our palace.` 
          : `We have received your reservation request for <strong>${roomName}</strong>. Our team is currently reviewing it.`}
      </p>
      
      <div style="background-color: #FDF4F7; padding: 25px; border-radius: 15px; margin: 30px 0;">
        <h3 style="color: #D14D7E; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Stay Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Check-In:</strong></td>
            <td style="padding: 8px 0; color: #1A0811;">${new Date(checkIn).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Check-Out:</strong></td>
            <td style="padding: 8px 0; color: #1A0811;">${new Date(checkOut).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4A3B42;"><strong>Total Price:</strong></td>
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

  if (resend) {
    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "GhostRed256@gmail.com";
      const data = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: Array.isArray(to) ? to : [to],
        cc: [adminEmail], // CC the admin to verify delivery
        subject: subject,
        html: emailHtml,
      });
      console.log(`Email request sent to Resend for ${to}. ID: ${data.data?.id}`);
      if (data.error) {
        console.error("Resend API returned an error:", data.error);
      }
    } catch (error: any) {
      console.error("Resend Email Error:", error?.message || error);
      if (error?.response) console.error("Resend Response Error:", error.response.data);
    }
  } else {
    console.warn("RESEND_API_KEY not found. Email logged to console below:");
    console.log(`[SUBJECT]: ${subject}`);
    console.log(`[TO]: ${to}`);
    console.log(`[CONTENT]: ${emailHtml.replace(/<[^>]*>/g, '')}`);
  }
  
  return { success: true };
}
