import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      date,
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

    if (!targetUrl) {
      return NextResponse.json(
        {
          error:
            "Google Sheets Webhook URL is not configured yet. Please provide the Webhook URL in the form or in .env file.",
        },
        { status: 400 }
      );
    }

    // Payload structured for Google Apps Script Webhook
    const payload = {
      action: "addGuestRecord",
      data: {
        date: date || new Date().toLocaleDateString("en-GB"),
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

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resText = await res.text();
    let resJson: any = null;
    try {
      resJson = JSON.parse(resText);
    } catch {
      resJson = { raw: resText };
    }

    if (!res.ok && res.status !== 302 && res.status !== 200) {
      return NextResponse.json(
        {
          error: `Google Sheets responded with status ${res.status}`,
          details: resJson,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Row added to Google Sheet successfully!",
      result: resJson,
    });
  } catch (err: any) {
    console.error("Sheet sync error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error syncing to sheet" },
      { status: 500 }
    );
  }
}
