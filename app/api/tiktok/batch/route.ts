import { NextResponse } from "next/server";
import { extractTikTokUrl, normalizeTikTokUrl, formatTikWMData, fetchTikWM } from "../lib";

function parseUrls(input: string | string[] | undefined) {
  if (Array.isArray(input)) return input.map((value) => String(value).trim()).filter(Boolean);
  if (typeof input === "string") {
    return input
      .split(/\n|\r/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((value) => normalizeTikTokUrl(extractTikTokUrl(value) || value));
  }
  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const urls = parseUrls(body?.urls || body?.text);

    if (urls.length === 0) {
      return NextResponse.json({ success: false, error: "Không tìm thấy đường dẫn TikTok nào hợp lệ." }, { status: 400 });
    }

    const items: Array<{ originalUrl: string; status: "success" | "error"; data?: any; error?: string }> = [];

    for (let i = 0; i < urls.length; i += 1) {
      const rawUrl = urls[i];
      const cleanUrl = normalizeTikTokUrl(extractTikTokUrl(rawUrl) || rawUrl);
      try {
        const tikwmData = await fetchTikWM(cleanUrl);
        if (!tikwmData || tikwmData.code !== 0 || !tikwmData.data) {
          items.push({ originalUrl: rawUrl, status: "error", error: tikwmData?.msg || "Không thể xử lý link này." });
        } else {
          items.push({ originalUrl: rawUrl, status: "success", data: formatTikWMData(tikwmData.data) });
        }
      } catch (error) {
        items.push({ originalUrl: rawUrl, status: "error", error: error instanceof Error ? error.message : "Lỗi khi xử lý link." });
      }

      if (i < urls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Lỗi hệ thống." }, { status: 500 });
  }
}
