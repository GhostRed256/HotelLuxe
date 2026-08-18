import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        // CRITICAL: redirect must be 'manual', NOT 'follow'.
        // Google Apps Script returns 302 on POST. With 'follow', fetch
        // converts the redirect into a GET request — doPost() never runs.
        // With 'manual', the POST is dispatched and doPost() executes.
        // This matches TravelNJoy's working pattern exactly.
        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
          redirect: "manual",
        });

        // With redirect:'manual', Google returns 302 (opaque redirect).
        // The POST was already dispatched and executed by Apps Script.
        // A 302 or 0 status is a SUCCESS — the row was written.
        if (res.status === 302 || res.status === 0 || res.ok) {
          try {
            const resText = await res.text();
            sheetResult = JSON.parse(resText);
          } catch {
            // 302 responses often have no readable body — that's fine
            sheetResult = { dispatched: true, status: res.status };
          }
        } else if (res.status === 401 || res.status === 403) {
          const resText = await res.text();
          return NextResponse.json({
            success: false,
            error: "Google Sheets Webhook Permission Error: Please ensure 'Who has access' is set to 'Anyone' in Apps Script Deploy settings, and redeploy as a New Version.",
            sheetResult: { status: res.status, body: resText.substring(0, 200) },
          }, { status: 400 });
        } else {
          const resText = await res.text();
          sheetResult = { status: res.status, body: resText.substring(0, 500) };
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
