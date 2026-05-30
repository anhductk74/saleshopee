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
  title: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
  description: "Cập nhật mã giảm giá Shopee, voucher mới nhất, mã freeship, deal hot và khuyến mãi hấp dẫn mỗi ngày.",
};

const SITE_URL = "https://sandealvip.com"; // <-- Thay bằng domain thật của bạn

export const seoMetadata: Metadata = {
  title: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
  description:
    "Cập nhật mã giảm giá Shopee, voucher mới nhất, mã freeship, deal hot và khuyến mãi hấp dẫn mỗi ngày.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Săn Mã Shopee",
  keywords: [
  "mã giảm giá Shopee",
  "voucher Shopee hôm nay",
  "mã giảm giá Shopee mới nhất",
  "mã freeship Shopee",
  "deal hot Shopee",
  "săn sale Shopee",
  "khuyến mãi Shopee",
  "voucher giảm giá Shopee",
  "flash sale Shopee",
  "ưu đãi Shopee",
  "mã giảm giá Lazada",
  "mã giảm giá TikTok Shop",
  "deal giá tốt",
  "săn deal online",
  "săn deal vip",
  "coupon mua sắm"
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
    title: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
    description:
      "Dán link Shopee để lấy link ưu đãi — nhanh, đơn giản, chuẩn SEO.",
    url: SITE_URL,
    siteName: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
    description:
      "Dán link Shopee để lấy link ưu đãi — nhanh, đơn giản, chuẩn SEO.",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="theme-color" content="#fb923c" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}

        {/* JSON-LD Organization (update values for production) */}
        <script
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
