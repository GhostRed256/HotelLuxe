import { sendBookingEmail } from "./email";

/**
 * Palace Unified Notification System
 * Orchestrates notifications to both guests and owners via Email, Telegram, and SMS.
 */

// Retrieve configuration options from environment
const getOwnerEmails = (): string[] => {
  const emails = process.env.OWNER_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "GhostRed256@gmail.com";
  return emails.split(",").map(email => email.trim()).filter(email => email !== "");
};

const getOwnerPhones = (): string[] => {
  const phones = process.env.OWNER_PHONES || "";
  return phones.split(",").map(phone => phone.trim()).filter(phone => phone !== "");
};

/**
 * Send a notification to a Telegram chat using a Telegram Bot
 */
async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return; // Telegram alerts not configured
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram Bot API Error:", data.description);
    } else {
      console.log("Telegram alert successfully sent to owner.");
    }
  } catch (error) {
    console.error("Failed to send Telegram alert:", error);
  }
}

/**
 * Send transactional SMS notifications via Fast2SMS API (Indian numbers)
 */
async function sendSMSAlert(toNumbers: string[], message: string) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey || toNumbers.length === 0) {
    return; // SMS not configured or no numbers
  }

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        language: "english",
        numbers: toNumbers.join(","),
      }),
    });

    const data = await response.json();
    if (data.return) {
      console.log(`Fast2SMS alert sent to: ${toNumbers.join(", ")}. Message: ${data.message}`);
    } else {
      console.error("Fast2SMS API Error:", data.message || data);
    }
  } catch (error) {
    console.error("Failed to send SMS alert:", error);
  }
}

/**
 * Notify the owner and guest of a new booking request
 */
export async function notifyNewBooking(booking: {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  upiTxnId?: string;
}, room: { name: string; price: number }) {
  const ownerEmails = getOwnerEmails();
  const ownerPhones = getOwnerPhones();

  // Format check-in / check-out dates
  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN");
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN");

  // Calculate pricing for notifications
  const d1 = new Date(booking.checkIn);
  const d2 = new Date(booking.checkOut);
  const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = nights * room.price;

  const emailPromises: Promise<any>[] = [];

  // 1. Notify Customer via Email
  if (booking.customerEmail && booking.customerEmail !== "N/A") {
    emailPromises.push(
      sendBookingEmail({
        to: booking.customerEmail,
        subject: `Your Palace Reservation Request: ${room.name}`,
        customerName: booking.customerName,
        roomName: room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: "PENDING",
        price: totalPrice
      }).catch(err => console.error("Error notifying customer via email:", err))
    );
  }

  // 2. Notify Owners via Email
  emailPromises.push(
    sendBookingEmail({
      to: ownerEmails,
      subject: `[NEW BOOKING REQUEST] ${booking.customerName} - ${room.name}`,
      customerName: booking.customerName,
      roomName: room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: "PENDING_OWNER_REVIEW",
      price: totalPrice,
      bookingId: booking.id
    }).catch(err => console.error("Error notifying owner via email:", err))
  );

  // Run email dispatches in parallel
  await Promise.all(emailPromises);

  // 3. Notify Owner via Telegram Bot
  const telegramMsg = `<b>🏰 New Booking Request!</b>\n\n` +
    `<b>Guest:</b> ${booking.customerName}\n` +
    `<b>Phone:</b> ${booking.customerPhone}\n` +
    `<b>Email:</b> ${booking.customerEmail}\n` +
    `<b>Room:</b> ${room.name}\n` +
    `<b>Stay:</b> ${checkInDate} to ${checkOutDate} (${nights} night${nights > 1 ? 's' : ''})\n` +
    `<b>Total Estimate:</b> ₹${totalPrice}\n` +
    `${booking.upiTxnId ? `<b>UTR Transaction ID:</b> <code>${booking.upiTxnId}</code>\n` : ""}` +
    `\n<i>Please log into the Admin Dashboard to Authorize or Decline.</i>`;

  await sendTelegramAlert(telegramMsg);

  // 4. Notify Owner via SMS (Fast2SMS)
  const smsMsg = `StayNjoy Palace Alert:\nNew request from ${booking.customerName} for ${room.name} from ${checkInDate} to ${checkOutDate}. Log in to Admin panel to verify.`;
  await sendSMSAlert(ownerPhones, smsMsg);
}

/**
 * Notify owner and guest when a booking status changes (APPROVED / REJECTED)
 */
export async function notifyBookingStatusChange(booking: {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
}, room: { name: string; price: number }, status: "APPROVED" | "REJECTED") {
  const ownerEmails = getOwnerEmails();
  const ownerPhones = getOwnerPhones();

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN");
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN");
  const bookingIdStr = booking.id ? booking.id.toUpperCase().substring(0, 8) : 'PENDING';


  const d1 = new Date(booking.checkIn);
  const d2 = new Date(booking.checkOut);
  const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = nights * room.price;

  const emailPromises: Promise<any>[] = [];

  // 1. Notify Customer via Email
  if (booking.customerEmail && booking.customerEmail !== "N/A") {
    emailPromises.push(
      sendBookingEmail({
        to: booking.customerEmail,
        subject: `Your Royal Stay is ${status === 'APPROVED' ? 'Confirmed' : 'Cancelled'}`,
        customerName: booking.customerName,
        roomName: room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: status,
        price: totalPrice,
        bookingId: bookingIdStr
      }).catch(err => console.error("Error notifying customer status update via email:", err))
    );

  }

  // 2. Notify Owners via Email
  emailPromises.push(
    sendBookingEmail({
      to: ownerEmails,
      subject: `[ADMIN ALERT] Booking ${status}: ${booking.customerName}`,
      customerName: booking.customerName,
      roomName: room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: status,
      price: totalPrice,
      bookingId: bookingIdStr
    }).catch(err => console.error("Error notifying owner status update via email:", err))
  );

  await Promise.all(emailPromises);

  // 3. Notify Owner via Telegram Bot
  const telegramMsg = `<b>📢 Booking Status Update</b>\n\n` +
    `<b>Guest:</b> ${booking.customerName}\n` +
    `<b>Room:</b> ${room.name}\n` +
    `<b>Stay:</b> ${checkInDate} to ${checkOutDate}\n` +
    `<b>Status:</b> ${status === 'APPROVED' ? '🟢 APPROVED' : '🔴 REJECTED'}`;

  await sendTelegramAlert(telegramMsg);

  // 4. Notify Owner via SMS
  const ownerSmsMsg = `StayNjoy Alert: Booking for ${booking.customerName} (${room.name}) is ${status}.`;
  await sendSMSAlert(ownerPhones, ownerSmsMsg);

  // 5. Notify Customer via SMS if Approved
  if (status === "APPROVED" && booking.customerPhone) {
    const customerSmsMsg = `StayNjoy: Your preboooking of Rs 300 is confirmed! Booking ID: ${bookingIdStr}. Dates: ${checkInDate}-${checkOutDate}. Check Email for Calendar & details.`;

    let cleanPhone = booking.customerPhone.trim().replace(/\D/g, "");
    if (cleanPhone.length > 10) cleanPhone = cleanPhone.substring(cleanPhone.length - 10);

    await sendSMSAlert([cleanPhone], customerSmsMsg);
  }
}

