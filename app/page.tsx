"use client";

import React, { useState, useRef } from "react";

const FACEBOOK_LINK =
  "https://www.facebook.com/groups/1313703766898681/posts/1313708710231520/?__cft__[0]=AZaTI8mQjzHWCNtLTrvPChbmdpuTb0OGWeKX9dvNVhFzaIWb0GEcH1Nms5lFuYlWzu-2t7z7WhkOsIswrBmnfK5X8SlYAcww1iCpT7UjYEnrDY6Bw-Y1WJY6P2QR7RDZ-kSlGLW3HgKIvQq6ln3P9G4fhPeji8RI6keXdGgQ2h6LQzU6YJsPCPbDLfR09_TdPL7Kd_z24UHJ7xzLQyHWxHWI&__tn__=-UK-R";
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
  const [statusMessage, setStatusMessage] = useState(
    "Dán link sản phẩm Shopee để xem ưu đãi phù hợp."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const invokeGuard = useRef(false);

  function formatDisplayUrl(url: string) {
    if (!url) return "";
    if (url.length <= 48) return url;

    return `${url.slice(0, 30)}...${url.slice(-12)}`;
  }

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
    setIsCopied(false);
    setStatusMessage("Đang tìm ưu đãi cho bạn...");

    try {
      console.log("handleCreateLink invoked", trimmedUrl);
      const response = await fetch(
        `/api/convert?url=${encodeURIComponent(trimmedUrl)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        // include response body to help debug network/server errors from mobile
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

  function handleOpenFacebookPost() {
    window.open(FACEBOOK_LINK, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_34%),radial-gradient(circle_at_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#fffdf8_0%,_#fff7ed_100%)] text-slate-950">
      <div className="hidden sm:block pointer-events-none absolute inset-0 z-0 opacity-60 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-4 sm:px-6 sm:py-8 lg:items-center lg:px-12 lg:py-10">
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          

          <div className="relative">
            <div className="hidden sm:block absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-300 via-orange-100 to-amber-200 blur-2xl" />
            <div className="relative z-20 rounded-[2rem] border-2 border-orange-200 bg-white/95 p-4 shadow-[0_30px_100px_rgba(249,115,22,0.2)] backdrop-blur-xl sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                    TẠO LINK ƯU ĐÃI SHOPEE
                  </p>
                </div>
              </div>


              <div className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-800 sm:text-base">
                    Dán link sản phẩm Shopee vào đây
                  </span>
                  <input
                    value={inputUrl}
                    onChange={(event) => setInputUrl(event.target.value)}
                    placeholder="https://s.shopee.vn/..."
                    className="pointer-events-auto h-14 w-full rounded-2xl border-2 border-orange-300 bg-orange-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-orange-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-200 sm:h-16 sm:text-lg"
                  />
                </label>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleCreateLink}
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-orange-300/40 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)] transition hover:brightness-105 disabled:opacity-60 disabled:cursor-wait"
                    >
                      {isLoading ? "Đang tạo liên kết..." : "Lấy liên kết khuyến mãi"}
                    </button>
                  </div>

                  

                {resultUrl && (
                  <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-inner shadow-slate-950/20 sm:p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Mã giảm giá / link ưu đãi</p>
                      <h3 className="mt-2 text-lg font-semibold sm:text-xl">Link ưu đãi 20%, 22%, 25% từ Facebook, MXH dành cho bạn</h3>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-100 sm:text-base sm:leading-7 break-all">
                        {resultUrl}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="pointer-events-auto inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-medium transition hover:bg-white/15 sm:h-14 sm:px-5"
                      >
                        {isCopied ? "Đã copy" : "Copy link"}
                      </button>
                    </div>

                    <a
                      href={resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleOpenShopee}
                      className="pointer-events-auto mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-orange-300/40 bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(249,115,22,0.18)] transition hover:brightness-105 sm:h-14 sm:text-base"
                    >
                      Mua ngay trên Shopee nhận ưu đãi MXH
                    </a>

                    <button
                      type="button"
                      onClick={handleOpenFacebookPost}
                      className="pointer-events-auto mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-blue-300 bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(37,99,235,0.18)] transition hover:brightness-105 sm:h-14 sm:text-base"
                    >
                      Mở bài viết Facebook cmt nhận voucher
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Săn mã giảm giá Shopee hôm nay
            </div>

           

            <div className="max-w-2xl rounded-3xl border-2 border-orange-400 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-[0_24px_60px_rgba(249,115,22,0.26)] backdrop-blur">
              <div className="inline-flex w-fit items-center rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Hướng dẫn nhanh
              </div>
              <div className="mt-3 text-base font-semibold text-slate-900 sm:text-lg">
                Làm theo 4 bước sau để thấy mã nhanh hơn
              </div>
              <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-800 sm:text-base">
                <li><span className="font-bold text-orange-700">B1.</span> Vào Shopee và copy link sản phẩm cần mua.</li>
                <li><span className="font-bold text-orange-700">B2.</span> Dán link vào rồi bấm Lấy liên kết khuyến mãi.</li>
                <li><span className="font-bold text-orange-700">B3.</span> Copy link kết quả và cmt tại bài viết: <a className="font-semibold text-orange-700 underline decoration-orange-400 underline-offset-4" href={FACEBOOK_LINK} target="_blank" rel="noopener noreferrer">Mở bài viết Facebook</a> (Có thể cmt ẩn danh).</li>
                <li><span className="font-bold text-orange-700">B4.</span> Mở lại link đã cmt để chọn voucher và đặt mua.</li>
                <li>
                  <span className="inline-block rounded-lg bg-orange-50 border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-800">
                    Có thể mở trực tiếp link qua ứng dụng Shopee để có 1 số ưu đãi khác
                  </span>
                </li>
              </ol>
              <div className="mt-4 rounded-2xl border border-orange-300 bg-orange-100 px-3 py-2 text-sm font-medium text-orange-900">
                Lưu ý: Nếu chưa thấy mã, hãy thử lại vào các khung giờ 0h, 9h, 15h, 20h.
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </main>
  );
}
