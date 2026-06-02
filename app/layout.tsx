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
  title: "Mã Giảm Giá Shopee Hôm Nay | sandealvip.com",
  description:
    "Cập nhật mã giảm giá Shopee hôm nay, voucher Shopee mới nhất, mã freeship, flash sale, deal hot và ưu đãi tại sandealvip.com.",
};

const SITE_URL = "https://sandealvip.com";

export const seoMetadata: Metadata = {
  title: "Mã Giảm Giá Shopee Hôm Nay | sandealvip.com",
  description:
    "Cập nhật mã giảm giá Shopee hôm nay, voucher Shopee mới nhất, mã freeship, flash sale, deal hot và ưu đãi tại sandealvip.com.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Săn Mã Shopee",
  keywords: [
    "mã giảm giá shopee",
    "mã giảm giá shopee hôm nay",
    "mã giảm giá shopee mới nhất",
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
    "săn deal shopee",
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
      "Dán link Shopee để lấy link ưu đãi nhanh, đơn giản tại sandealvip.com.",
    url: SITE_URL,
    siteName: "Mã Giảm Giá Shopee & Deal Hot Mỗi Ngày",
    images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mã Giảm Giá Shopee Hôm Nay | sandealvip.com",
    description:
      "Dán link Shopee để lấy link ưu đãi nhanh, đơn giản tại sandealvip.com.",
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
