import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response as NextResponse;
  }

  const body = await request.json().catch(() => ({}));
  const folder = typeof body.folder === "string" ? body.folder : "cafe-menu";
  const timestamp = Math.round(Date.now() / 1000);

  const signature = getCloudinary().utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
