import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Raw = buffer.toString("base64");

    let mimeType = file.type || "image/jpeg";
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    if (!file.type || file.type === "application/octet-stream") {
      if (ext === "webp") mimeType = "image/webp";
      else if (ext === "png") mimeType = "image/png";
      else if (ext === "pdf") mimeType = "application/pdf";
      else mimeType = "image/jpeg";
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials missing" },
        { status: 500 }
      );
    }

    const base64Data = `data:${mimeType};base64,${base64Raw}`;
    const cForm = new FormData();
    cForm.append("file", base64Data);

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "staynjoy_kyc";

    let originalName = file.name ? file.name.split(".").slice(0, -1).join(".") : "";
    if (originalName) {
      originalName = originalName.replace(/[^a-zA-Z0-9_-]/g, "-");
      cForm.append("public_id", `${originalName}-${Date.now()}`);
    }

    let strToSign = `folder=${folder}`;
    if (originalName) {
      strToSign += `&public_id=${originalName}-${timestamp}`;
    }
    // Simple signature
    const signString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signString).digest("hex");

    cForm.append("api_key", apiKey);
    cForm.append("timestamp", timestamp);
    cForm.append("folder", folder);
    cForm.append("signature", signature);

    const cRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cForm,
      }
    );

    const cData = await cRes.json();
    if (cData.secure_url || cData.url) {
      return NextResponse.json({
        success: true,
        url: cData.secure_url || cData.url,
      });
    }

    console.error("Cloudinary upload failed:", cData);
    return NextResponse.json(
      { error: "Cloudinary upload failed", details: cData },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
