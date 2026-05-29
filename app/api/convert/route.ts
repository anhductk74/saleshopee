import { NextResponse } from "next/server";

const AFFILIATE_ID = "17378790583";
const AFFILIATE_API_URL = "https://addlivetag.com/short-link.php";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inputUrl = searchParams.get("url")?.trim() ?? "";

  if (!inputUrl) {
    return NextResponse.json(
      { success: false, message: "Thiếu link Shopee." },
      { status: 400 }
    );
  }

  try {
    const target = new URL(AFFILIATE_API_URL);
    target.searchParams.set("affiliate_id", AFFILIATE_ID);
    target.searchParams.set("url", inputUrl);

    const response = await fetch(target.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API trả về mã ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: Boolean(data?.success),
      url: data?.url ?? inputUrl,
      affiliateLink: data?.affiliateLink ?? "",
      subids: data?.subids ?? null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Không thể tạo link affiliate lúc này.",
      },
      { status: 500 }
    );
  }
}