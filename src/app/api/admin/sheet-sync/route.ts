import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      date,
      checkIn,
      checkOut,
      roomId,
      location,
      guestName,
      roomNo,
      address,
      parentName,
      phone,
      cash,
      online,
      notes,
      preBookingScreenshot,
      postBookingScreenshot,
      webhookUrl: overrideUrl,
    } = body;

    const targetUrl = overrideUrl || process.env.SHEETS_WEBAPP_URL;

    // 1. Sync / Block Room in Firestore if roomId or roomNo is provided
    let createdBookingId: string | null = null;
    try {
      let targetRoomId = roomId;

      // If roomId wasn't directly passed, find room by name
      if (!targetRoomId && roomNo) {
        const roomsSnap = await db.collection("rooms").get();
        const found = roomsSnap.docs.find((d: any) => {
          const r = d.data();
          return (
            r.name?.toLowerCase().includes(roomNo.toLowerCase()) ||
            r.roomNumber === roomNo
          );
        });
        if (found) {
          targetRoomId = found.id;
        }
      }

      if (targetRoomId) {
        const inDate = checkIn || date || new Date().toISOString().split("T")[0];
        // Default checkout is next day if not provided
        let outDate = checkOut;
        if (!outDate) {
          const nextDay = new Date(inDate);
          nextDay.setDate(nextDay.getDate() + 1);
          outDate = nextDay.toISOString().split("T")[0];
        }

        const bookingRef = await db.collection("bookings").add({
          roomId: targetRoomId,
          customerName: guestName || "Guest",
          customerPhone: phone || "",
          customerEmail: "admin@staynjoy.com",
          checkIn: inDate,
          checkOut: outDate,
          status: "APPROVED",
          paymentStatus: cash || online ? "PAID" : "MANUAL",
          address: address || "",
          parentName: parentName || "",
          notes: notes || "",
          preBookingScreenshot: preBookingScreenshot || "",
          postBookingScreenshot: postBookingScreenshot || "",
          isSheetSyncBooking: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        createdBookingId = bookingRef.id;

        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath("/rooms");
        revalidatePath("/homestays");
      }
    } catch (dbErr) {
      console.error("Firestore booking block error (non-fatal):", dbErr);
    }

    // 2. Append to Google Sheets via Webhook
    let sheetResult: any = null;
    if (targetUrl) {
      const payload = {
        action: "addGuestRecord",
        data: {
          date: date || new Date().toLocaleDateString("en-GB"),
          location: location || "Chaliha Nagar",
          guestName: guestName || "",
          roomNo: roomNo || "",
          address: address || "",
          parentName: parentName || "",
          phone: phone || "",
          cash: cash || "",
          online: online || "",
          notes: notes || "",
          preBookingScreenshot: preBookingScreenshot || "",
          postBookingScreenshot: postBookingScreenshot || "",
        },
      };

      try {
        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          redirect: "follow",
        });

        const resText = await res.text();
        try {
          sheetResult = JSON.parse(resText);
        } catch {
          sheetResult = { raw: resText };
        }
      } catch (sheetErr: any) {
        console.error("Google Sheets request failed:", sheetErr);
        sheetResult = { error: sheetErr.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: "Synced to Google Sheet and booked in website calendar!",
      bookingId: createdBookingId,
      sheetResult,
    });
  } catch (err: any) {
    console.error("Sheet sync route error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error syncing record" },
      { status: 500 }
    );
  }
}
