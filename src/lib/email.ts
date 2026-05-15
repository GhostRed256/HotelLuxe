/**
 * Royal Email Service
 * 
 * To enable real emails, install 'resend' and add RESEND_API_KEY to your .env
 * npm install resend
 */

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
  const emailContent = `
    ROYAL BOOKING NOTIFICATION
    --------------------------
    Status: ${status}
    Customer: ${customerName}
    Room: ${roomName}
    Dates: ${checkIn} to ${checkOut}
    Total: ₹${price || 'N/A'}
    
    This is an automated notification from the Stay-N-Joy Palace Management System.
  `;

  // Log to console for development verification
  console.log(`--- [EMAIL SENT] ---`);
  console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${emailContent}`);
  console.log(`---------------------`);

  // Integration with Resend (Placeholder)
  /*
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'Stay-N-Joy <bookings@staynjoy.com>',
    to: to,
    subject: subject,
    text: emailContent,
  });
  */
  
  return { success: true };
}
