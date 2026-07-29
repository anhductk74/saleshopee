import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url")?.trim();
    const filename = searchParams.get("filename")?.trim() || "tiktok-download";

    if (!mediaUrl) {
      return new NextResponse("Missing media URL", { status: 400 });
    }

    const response = await fetch(mediaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok || !response.body) {
      return new NextResponse("Failed to fetch media stream", { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-À-ÿ]/g, "_");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(safeFilename)}.mp4"`);
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(response.body, { status: 200, headers });
  } catch (error) {
    return new NextResponse("Error downloading file", { status: 500 });
  }
}
