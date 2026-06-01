import { NextResponse } from "next/server";

const AFFILIATE_ID = "17358420175";
const AFFILIATE_API_URL = "https://addlivetag.com/short-link.php";

const TRACKING_PARAMS_TO_REMOVE = new Set([
  "af_force_deeplink",
  "af_sub1",
  "af_sub2",
  "af_sub3",
  "af_sub4",
  "af_sub5",
  "d_id",
  "gid",
  "is_from_login",
  "itemid",
  "k",
  "mibextid",
  "ppid",
  "share",
  "sharer_id",
  "sp_atk",
  "spm",
  "uls_trackid",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

function extractFirstUrl(value: string) {
  const match = value.match(/https?:\/\/[^\s<>"]+/i);
  return match?.[0] ?? value;
}

function normalizeShopeeUrl(rawUrl: string) {
  const normalized = new URL(rawUrl);

  for (const key of Array.from(normalized.searchParams.keys())) {
    if (TRACKING_PARAMS_TO_REMOVE.has(key.toLowerCase())) {
      normalized.searchParams.delete(key);
    }
  }

  if (normalized.hostname.includes("shopee")) {
    normalized.hash = "";
  }

  return normalized.toString();
}

async function cleanShopeeLink(inputUrl: string) {
  const candidateUrl = extractFirstUrl(inputUrl).trim();
  const parsedUrl = new URL(candidateUrl);

  const response = await fetch(parsedUrl.toString(), {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
  });

  const finalUrl = response.url || parsedUrl.toString();
  return normalizeShopeeUrl(finalUrl);
}

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
    const cleanedUrl = await cleanShopeeLink(inputUrl);

    const target = new URL(AFFILIATE_API_URL);
    target.searchParams.set("affiliate_id", AFFILIATE_ID);
    target.searchParams.set("url", cleanedUrl);

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
      url: data?.url ?? cleanedUrl,
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