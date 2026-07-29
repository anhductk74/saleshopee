import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Săn Sale Rẻ Shopee | Mã Giảm Giá 22%, 25% & Voucher Shopee",
  description:
    "Tạo link ưu đãi Shopee, tìm mã giảm giá 22%, 25%, voucher Shopee, freeship và deal hot mỗi ngày tại sandealvip.com.",
  alternates: {
    canonical: "https://sandealvip.com",
  },
};

const SITE_URL = "https://sandealvip.com";

export const seoMetadata: Metadata = {
  title: "Mã Giảm Giá Shopee Hôm Nay | sandealvip.com",
  description:
    "Tạo link ưu đãi Shopee, tìm mã giảm giá, voucher, freeship và deal hot mỗi ngày tại sandealvip.com.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Săn Mã Shopee",
  keywords: [
    "mã giảm giá shopee",
    "mã giảm giá shopee hôm nay",
    "mã giảm giá shopee mới nhất",
    "mã giảm 22% shopee",
    "mã giảm 25% shopee",
    "voucher shopee",
    "voucher shopee hôm nay",
    "voucher shopee mới nhất",
    "mã freeship shopee",
    "mã hoàn xu shopee",
    "flash sale shopee",
    "deal hot shopee",
    "săn sale shopee",
    "ưu đãi shopee",
    "khuyến mãi shopee",
    "coupon shopee",
    "deal shopee",
    "săn sale rẻ shopee",
    "săn deal shopee",
    "tải video hàng loạt tiktok không logo",
    "tải video tiktok không dính logo",
    "mã giảm giá lazada",
    "mã giảm giá tiktok shop",
    "coupon mua sắm",
    "deal giá tốt",
    "sandealvip.com",
    "sandealvip",
    "săn deal vip",
    "mã giảm giá online",
    "voucher giảm giá",
  ],
  authors: [{ name: "CustomLink" }],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Mã Giảm Giá Shopee Hôm Nay | sandealvip.com",
    description:
      "Tạo link ưu đãi Shopee, tìm mã giảm giá, voucher, freeship và deal hot mỗi ngày tại sandealvip.com.",
    url: SITE_URL,
    siteName: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630, alt: "Săn mã giảm giá Shopee hôm nay" }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mã Giảm Giá Shopee Hôm Nay | sandealvip.com",
    description:
      "Tạo link ưu đãi Shopee, tìm mã giảm giá, voucher, freeship và deal hot mỗi ngày tại sandealvip.com.",
    images: [`${SITE_URL}/og-image.svg`],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
        <meta name="theme-color" content="#fb923c" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="google-site-verification" content="" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}

        {/* JSON-LD Organization (update values for production) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Săn Mã Shopee",
              url: SITE_URL,
              logo: `${SITE_URL}/og-image.svg`,
              sameAs: [],
            }),
          }}
        />
      </body>
    </html>
  );
}
