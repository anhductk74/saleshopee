import { NextResponse } from "next/server";

const AFFILIATE_ID = "";
const AFFILIATE_API_URL = "https://addlivetag.com/short-link.php";
const PRODUCT_DATA_API_URL =
  "https://data.addlivetag.com/product-data/product-data.php";

type AffiliateApiResponse = {
  success?: boolean;
  url?: string;
  affiliateLink?: string;
  subids?: unknown;
};

type VoucherLinkApiResponse = {
  success?: boolean;
  final_url?: string;
  error?: string;
};

type ProductInfo = {
  productName?: string;
  shopName?: string;
  imageUrl?: string;
  price?: number;
};

type ProductDataResult = {
  productInfo: ProductInfo | null;
  productMessage?: string;
};

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toProductInfo(value: unknown): ProductInfo | null {
  if (!isRecord(value)) return null;

  const productInfo: ProductInfo = {};
  if (typeof value.productName === "string") {
    productInfo.productName = value.productName;
  }
  if (typeof value.shopName === "string") {
    productInfo.shopName = value.shopName;
  }
  if (typeof value.imageUrl === "string") {
    productInfo.imageUrl = value.imageUrl;
  }
  if (typeof value.price === "number" && Number.isFinite(value.price)) {
    productInfo.price = value.price;
  }

  return Object.keys(productInfo).length > 0 ? productInfo : null;
}

async function getProductInfo(cleanedUrl: string): Promise<ProductDataResult> {
  const apiKey = process.env.PRODUCT_DATA_API_KEY?.trim();
  if (!apiKey) {
    return {
      productInfo: null,
      productMessage: "Chưa cấu hình API key để lấy thông tin sản phẩm.",
    };
  }

  const target = new URL(PRODUCT_DATA_API_URL);
  target.searchParams.set("url", cleanedUrl);

  let response: Response;
  try {
    response = await fetch(target.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
  } catch {
    return {
      productInfo: null,
      productMessage: "Không thể kết nối API thông tin sản phẩm.",
    };
  }

  if (!response.ok) {
    return {
      productInfo: null,
      productMessage: `API thông tin sản phẩm trả về mã ${response.status}.`,
    };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return {
      productInfo: null,
      productMessage: "API thông tin sản phẩm trả về dữ liệu không hợp lệ.",
    };
  }

  if (!isRecord(data) || data.status !== "success") {
    return {
      productInfo: null,
      productMessage: "Không tìm thấy thông tin sản phẩm.",
    };
  }

  const productInfo = toProductInfo(data.productInfo);
  return productInfo
    ? { productInfo }
    : {
        productInfo: null,
        productMessage: "API không trả về thông tin sản phẩm hợp lệ.",
      };
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
    const productDataPromise = getProductInfo(cleanedUrl);

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

    const data = (await response.json()) as AffiliateApiResponse;

    if (
      !data.success ||
      typeof data.affiliateLink !== "string" ||
      !data.affiliateLink.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy link affiliate phù hợp.",
        },
        { status: 502 }
      );
    }

    const voucherLinkApiUrl = process.env.VOUCHER_LINK_API_URL?.trim();
    if (!voucherLinkApiUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Chưa cấu hình địa chỉ API chuyển đổi link voucher.",
        },
        { status: 500 }
      );
    }

    let voucherResponse: Response;
    try {
      voucherResponse = await fetch(voucherLinkApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.affiliateLink.trim(),
          delete_comment: true,
        }),
        cache: "no-store",
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Không thể kết nối dịch vụ chuyển đổi link voucher.",
        },
        { status: 502 }
      );
    }

    if (!voucherResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Dịch vụ chuyển đổi link voucher trả về mã ${voucherResponse.status}.`,
        },
        { status: 502 }
      );
    }

    let voucherData: VoucherLinkApiResponse;
    try {
      voucherData = (await voucherResponse.json()) as VoucherLinkApiResponse;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Dịch vụ chuyển đổi link voucher trả về dữ liệu không hợp lệ.",
        },
        { status: 502 }
      );
    }

    if (
      !voucherData.success ||
      typeof voucherData.final_url !== "string" ||
      !voucherData.final_url.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: voucherData.error ?? "Không thể hoàn tất chuyển đổi link voucher.",
        },
        { status: 502 }
      );
    }

    const productData = await productDataPromise;

    return NextResponse.json({
      success: true,
      url: data.url ?? cleanedUrl,
      finalUrl: voucherData.final_url.trim(),
      subids: data.subids ?? null,
      ...productData,
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