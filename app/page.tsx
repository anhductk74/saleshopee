"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const FACEBOOK_LINK =
  "https://www.facebook.com/share/p/1VekAJxwGW/?mibextid=wwXIfr";
const CLICK_LOG_API = "/api/click-log";

type ApiResponse = {
  success?: boolean;
  url?: string;
  affiliateLink?: string;
  message?: string;
};

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [sourceInputUrl, setSourceInputUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const invokeGuard = useRef(false);
  const instructionsRef = useRef<HTMLElement>(null);

  async function handleCreateLink() {
    if (invokeGuard.current) return;
    invokeGuard.current = true;
    const trimmedUrl = inputUrl.trim();

    if (!trimmedUrl) {
      setResultUrl("");
      setSourceInputUrl("");
      setStatusMessage("Vui lòng nhập link Shopee để xem mã giảm giá và ưu đãi.");
      invokeGuard.current = false;
      return;
    }

    setIsLoading(true);
    setResultUrl("");
    setSourceInputUrl("");
    setIsCopied(false);
    setStatusMessage("Đang tìm ưu đãi cho bạn...");

    try {
      const response = await fetch(
        `/api/convert?url=${encodeURIComponent(trimmedUrl)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API lỗi ${response.status}: ${text}`);
      }

      const data = (await response.json()) as ApiResponse;

      if (!data.success || !data.affiliateLink) {
        throw new Error(data.message ?? "Không tìm thấy ưu đãi phù hợp.");
      }

      setResultUrl(data.affiliateLink);
      setSourceInputUrl(trimmedUrl);
      setInputUrl("");
      setStatusMessage("Đã có link ưu đãi. Bạn có thể copy ngay bên dưới.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra.";
      setResultUrl("");
      setSourceInputUrl("");
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
      invokeGuard.current = false;
    }
  }

  async function handleCopyLink() {
    if (!resultUrl) {
      return;
    }

    await navigator.clipboard.writeText(resultUrl);

    if (sourceInputUrl) {
      fetch(CLICK_LOG_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: sourceInputUrl }),
      }).catch(() => {});
    }

    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1800);
  }

  function handleOpenShopee() {
    if (!resultUrl) return;

    const linkToLog = sourceInputUrl || resultUrl;

    fetch(CLICK_LOG_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: linkToLog }),
    }).catch(() => {});
  }

  function handleShowInstructions() {
    instructionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fffaf4] text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-orange-200/45 blur-3xl" />
        <div className="absolute -right-40 top-64 h-[28rem] w-[28rem] rounded-full bg-amber-100/70 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#c2410c_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6">
        <header className="flex items-center justify-between py-5 sm:py-7">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">SanDeal<span className="text-orange-600">VIP</span></span>
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-orange-800 shadow-sm sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            Tiện ích săn ưu đãi Shopee
          </span>
        </header>

        <section className="grid flex-1 content-center gap-8 pb-10 pt-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pb-16 lg:pt-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/85 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-orange-700 shadow-sm">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="m10 1.5 2.25 5.4 5.85.48-4.45 3.82 1.36 5.7L10 13.85l-5.01 3.05 1.36-5.7L1.9 7.38l5.85-.48L10 1.5Z" />
              </svg>
              Săn ưu đãi thông minh
            </div>

            <h1 className="max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
              Tạo link ưu đãi,
              <span className="mt-1 block text-orange-600">mua sắm tiết kiệm hơn.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Dán link sản phẩm Shopee để tạo link ưu đãi. Làm theo hướng dẫn để tìm voucher từ bài viết Facebook.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-[0_24px_70px_rgba(124,45,18,0.10)] sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M10.5 3.75H6.75A2.25 2.25 0 0 0 4.5 6v12a2.25 2.25 0 0 0 2.25 2.25h10.5A2.25 2.25 0 0 0 19.5 18V9.75L13.5 3.75h-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M13.5 3.75v6h6m-12 4.5h9m-9 3h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Tạo link ưu đãi Shopee</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Chỉ mất vài giây để bắt đầu</p>
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleCreateLink();
                }}
                className="space-y-3"
              >
                <label htmlFor="shopee-url" className="block text-sm font-semibold text-slate-700">
                  Link sản phẩm Shopee
                </label>
                <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-slate-400">
                    <path d="M10.5 13.5 13.5 10.5m-5.25 6.75H6a3.75 3.75 0 0 1 0-7.5h4.5m3-3H18a3.75 3.75 0 0 1 0 7.5h-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input
                    id="shopee-url"
                    value={inputUrl}
                    onChange={(event) => setInputUrl(event.target.value)}
                    placeholder="https://shopee.vn/..."
                    autoComplete="url"
                    className="h-full min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Đang tìm ưu đãi...
                    </>
                  ) : (
                    <>
                      Tạo link ưu đãi
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69L10.22 5.03a.75.75 0 1 1 1.06-1.06l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l4.22-4.22H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {statusMessage && (
                <p role="status" aria-live="polite" className="mt-4 flex items-start gap-2.5 rounded-xl border border-orange-100 bg-orange-50 px-3.5 py-3 text-sm leading-5 text-orange-900">
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-orange-600">
                    <path fillRule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-7-3a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0V7Zm-1 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {statusMessage}
                </p>
              )}

              {resultUrl && (
                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15">
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42 0l-3.8-3.84a1 1 0 1 1 1.42-1.41l3.09 3.12 6.49-6.54a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Link đã sẵn sàng
                  </div>
                  <p className="mt-3 break-all rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-slate-200">
                    {resultUrl}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-slate-900 transition hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {isCopied ? (
                      <>
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-600">
                          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42 0l-3.8-3.84a1 1 0 1 1 1.42-1.41l3.09 3.12 6.49-6.54a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
                        </svg>
                        Đã sao chép
                      </>
                    ) : (
                      "Sao chép link"
                    )}
                  </button>
                  <a
                    href={resultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenShopee}
                    className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                  >
                    Mở link trên Shopee
                  </a>
                  <button
                    type="button"
                    onClick={handleShowInstructions}
                    className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Cách nhận voucher
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-600">
                <path fillRule="evenodd" d="M10 1.75 3.5 4v4.73c0 4.2 2.7 7.88 6.5 9.52 3.8-1.64 6.5-5.32 6.5-9.52V4L10 1.75Zm3.03 5.72a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 1 1 1.06-1.06L9 9.94l2.97-2.47a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              Mã giảm giá và ưu đãi tùy điều kiện từ Shopee
            </p>
          </div>

          <aside
            ref={instructionsRef}
            id="voucher-instructions"
            className="scroll-mt-6 rounded-[1.75rem] border border-white bg-white/80 p-5 shadow-[0_24px_70px_rgba(124,45,18,0.08)] backdrop-blur sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Bắt đầu thật dễ</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Nhận voucher qua 4 bước</h2>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                  <path d="M12 3.5 14.2 9l5.8.5-4.4 3.8 1.3 5.7-4.9-3.1-4.9 3.1 1.3-5.7L4 9.5l5.8-.5L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <ol className="mt-7 space-y-5">
              {[
                "Mở Shopee và sao chép link sản phẩm bạn muốn mua.",
                "Dán link vào ô bên trên rồi bấm “Tạo link ưu đãi”.",
                "Sao chép link mới và bình luận tại bài viết Facebook.",
                "Mở lại link đã bình luận để chọn voucher và đặt mua.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-extrabold text-orange-700">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
                </li>
              ))}
            </ol>

            <a
              href={FACEBOOK_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Mở bài viết Facebook
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 1 0-1.06l7.97-7.97H7.5a.75.75 0 0 1 0-1.5H15a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0V6.81l-7.97 7.97a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
              </svg>
            </a>

            <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-600">
                  <path fillRule="evenodd" d="M9.4 2.6a.7.7 0 0 1 1.2 0l7.1 12.3a.7.7 0 0 1-.6 1.05H2.9a.7.7 0 0 1-.6-1.05L9.4 2.6ZM10 7a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 10 7Zm0 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" clipRule="evenodd" />
                </svg>
                Chưa thấy mã giảm giá?
              </p>
              <p className="mt-1.5 text-sm leading-6 text-amber-800">
                Thử lại vào các khung giờ 0h, 9h, 15h hoặc 20h. Bạn cũng có thể mở link trực tiếp bằng ứng dụng Shopee để xem ưu đãi khác.
              </p>
            </div>
          </aside>
        </section>

        <footer className="border-t border-orange-200/70 py-5 text-center text-xs text-slate-500">
          SanDealVIP · Tiện ích hỗ trợ tìm ưu đãi khi mua sắm trên Shopee
        </footer>
      </div>
    </main>
  );
}
