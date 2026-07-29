import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://sandealvip.com";
const SITE_NAME = "SanDealVIP";
const SITE_DESCRIPTION = "Nền tảng tiện ích đa năng: Tự động chuyển đổi link nhận mã giảm giá Shopee 22%-25% và công cụ tải video TikTok HD không logo miễn phí.";

// 1. Cấu hình Viewport (Tách riêng theo chuẩn Next.js mới)
export const viewport: Viewport = {
  themeColor: "#fb923c",
};

// 2. Cấu hình SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Săn Mã Giảm Giá Shopee & Tải Video TikTok Không Logo | SanDealVIP",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  keywords: [
    "mã giảm giá shopee",
    "chuyển đổi link shopee",
    "link ưu đãi shopee",
    "voucher shopee 22%",
    "voucher shopee 25%",
    "săn sale shopee",
    "tải video tiktok không logo",
    "tải video tiktok hd",
    "download tiktok mp4",
    "sandealvip",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Tiện Ích SanDealVIP | Săn Sale Shopee & Tải TikTok Không Logo",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Công cụ Săn Sale Shopee và Tải Video TikTok",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiện Ích SanDealVIP | Săn Sale Shopee & Tải TikTok Không Logo",
    description: SITE_DESCRIPTION,
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Thay bằng mã xác minh Google Search Console của bạn
    google: "NHẬP_MÃ_GOOGLE_SEARCH_CONSOLE_VAO_DAY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 3. Schema JSON-LD đa ứng dụng
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "vi-VN",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.svg`,
        sameAs: [],
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#shopee-tool`,
        name: "Công cụ tạo link ưu đãi và săn mã Shopee",
        url: SITE_URL,
        applicationCategory: "ShoppingApplication",
        description: "Công cụ tự động chuyển đổi link Shopee để lấy mã giảm giá 22%, 25% và Freeship.",
        operatingSystem: "All",
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#tiktok-tool`,
        name: "Công cụ tải video TikTok không logo",
        url: SITE_URL,
        applicationCategory: "MultimediaApplication",
        description: "Tiện ích tải video TikTok chất lượng HD, không dính logo miễn phí.",
        operatingSystem: "All",
      },
    ],
  };

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Chèn JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Chèn Google Analytics chuẩn SEO (Không làm chậm web) */}
        {/* Bỏ comment và điền mã G-XXXXX của bạn khi cần */}
        {/*
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MÃ_CỦA_BẠN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MÃ_CỦA_BẠN');
          `}
        </Script>
        */}
      </body>
    </html>
  );
}