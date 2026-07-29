import { NextResponse } from "next/server";
import { extractTikTokUrl, normalizeTikTokUrl, formatTikWMData, fetchTikWM } from "../lib";

async function handleInfoRequest(rawUrl: string) {
  try {
    const extracted = extractTikTokUrl(rawUrl) || rawUrl;
    const cleanUrl = normalizeTikTokUrl(extracted);

    if (!cleanUrl || !cleanUrl.includes("tiktok.com")) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đường dẫn TikTok hợp lệ." },
        { status: 400 }
      );
    }

    const tikwmData = await fetchTikWM(cleanUrl);

    if (!tikwmData || tikwmData.code !== 0 || !tikwmData.data) {
      const message = tikwmData?.msg || "Không thể lấy dữ liệu video từ link này. Vui lòng kiểm tra lại đường dẫn hoặc thử lại sau.";
      return NextResponse.json({ success: false, error: message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: formatTikWMData(tikwmData.data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi hệ thống khi xử lý link TikTok.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawUrl = typeof body?.url === "string" ? body.url : "";
    return handleInfoRequest(rawUrl);
  } catch {
    return NextResponse.json({ success: false, error: "Lỗi hệ thống khi xử lý link TikTok." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim() || "";
  return handleInfoRequest(rawUrl);
}
