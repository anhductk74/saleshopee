"use client";

import { useState, useRef } from "react";

type ApiResponse = {
  success?: boolean;
  url?: string;
  affiliateLink?: string;
  message?: string;
};

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
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
      setInputUrl("");
      setStatusMessage("Đã có link ưu đãi. Bạn có thể copy ngay bên dưới.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra.";
      setResultUrl("");
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
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1800);
  }

  

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_34%),radial-gradient(circle_at_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,_#fffdf8_0%,_#fff7ed_100%)] text-slate-950">
      <div className="hidden sm:block pointer-events-none absolute inset-0 z-0 opacity-60 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-4 sm:px-6 sm:py-8 lg:items-center lg:px-12 lg:py-10">
        <section className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="order-2 flex flex-col justify-center gap-6 lg:order-1">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-orange-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Săn mã giảm giá Shopee hôm nay
            </div>

            <div className="space-y-3 lg:space-y-5">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Nhập link Shopee, xem ngay ưu đãi và mã giảm giá để mua tiết kiệm hơn.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Chỉ cần dán link sản phẩm, hệ thống sẽ tạo đường dẫn ưu đãi
                gọn đẹp để bạn mở xem giá, mã giảm và chọn mua nhanh hơn.
                Giao diện thân thiện, dễ dùng trên điện thoại lẫn máy tính.
              </p>
            </div>

            <div className="max-w-2xl rounded-3xl border border-orange-200/80 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Hướng dẫn lấy mã giảm giá Facebook
              </div>
              <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-700 sm:text-base">
                <li>➡️Bước 1: Vào Shopee lấy link sản phẩm cần mua</li>
                <li>➡️Bước 2: Đổi link Shopee tại &gt;&gt; <a className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-4" href="https://sandealvip.com/" target="_blank" rel="noopener noreferrer">https://sandealvip.com/</a></li>
                <li>➡️Bước 3: Cmt link đã tạo tại bài viết bất kỳ trên Facebook</li>
                <li>➡️Bước 4: Click vào link vừa cmt rồi chọn voucher đặt mua.</li>
              </ol>
              <div className="mt-4 space-y-2 rounded-2xl border border-orange-100 bg-orange-50/60 p-3 text-sm leading-6 text-slate-700 sm:text-base">
                <p>🆘Lưu ý: Nếu không có mã thì có thể acc bị lọc hoặc sản phẩm bị lọc mã.</p>
                <p>✅ Khung giờ: ► 0H, 9H, 15H, 20H back lượt (thường lên trễ 10 phút)</p>
              </div>
            </div>

            <div className="hidden sm:grid gap-3 sm:grid-cols-3">
              {[
                ["Nhanh", "Dán link và xem ưu đãi chỉ trong vài giây."],
                ["Dễ dùng", "Tối giản, rõ ràng, không cần thao tác phức tạp."],
                ["Tiết kiệm", "Hướng đến trải nghiệm săn deal cho khách mua."],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <div className="text-sm font-semibold text-slate-950">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="hidden sm:block absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-200 via-white to-blue-200 blur-2xl" />
            <div className="relative z-20 rounded-[2rem] border border-white/70 bg-white/92 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-600">
                    Xem ưu đãi
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-2xl">
                    Dán link sản phẩm bạn đang quan tâm
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["Mã giảm giá", "Gợi ý đường dẫn để xem ưu đãi tốt hơn."],
                  ["Flash sale", "Hiển thị theo phong cách săn deal dễ nhìn."],
                  ["Mua nhanh", "Mở link, xem giá, copy và dùng ngay."],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-orange-100 bg-orange-50/70 p-3"
                  >
                    <div className="text-sm font-semibold text-slate-950">
                      {title}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-600">
                      {description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700 sm:text-base">
                    Link sản phẩm Shopee
                  </span>
                  <input
                    value={inputUrl}
                    onChange={(event) => setInputUrl(event.target.value)}
                    placeholder="https://s.shopee.vn/..."
                    className="pointer-events-auto h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 sm:h-16 sm:text-lg"
                  />
                </label>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleCreateLink}
                      disabled={isLoading}
                      className="w-full rounded-2xl border border-orange-300/40 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(249,115,22,0.18)] transition disabled:opacity-60 disabled:cursor-wait"
                    >
                      {isLoading ? "Đang tạo liên kết..." : "Lấy liên kết khuyến mãi"}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                  <div className="text-sm font-medium text-slate-700">
                    Thông báo ưu đãi
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {statusMessage}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-inner shadow-slate-950/20 sm:p-5">
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Mã giảm giá / link ưu đãi
                      </p>
                      <h3 className="mt-2 text-lg font-semibold sm:text-xl">
                        Ưu đãi dành cho bạn
                      </h3>
                    </div>
                    {resultUrl ? (
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="pointer-events-auto rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15 w-full sm:w-auto text-center"
                      >
                        {isCopied ? "Đã copy" : "Copy link"}
                      </button>
                    ) : null}
                  </div>

                    {resultUrl ? (
                    <a
                      href={resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-orange-300/40 bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(249,115,22,0.18)] transition hover:brightness-105 sm:h-14 sm:text-base"
                    >
                      Mở bằng app Shopee
                    </a>
                  ) : null}

                  <div className="mt-4 break-all rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-100 sm:text-base sm:leading-7">
                    {resultUrl
                      ? formatDisplayUrl(resultUrl)
                      : "Mã giảm giá hoặc link ưu đãi sẽ hiển thị ở đây sau khi xem."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </main>
  );
}
