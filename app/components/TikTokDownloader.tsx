"use client";

import { useState } from "react";

type TikTokAuthor = {
  id: string;
  uniqueId: string;
  nickname: string;
  avatar: string;
};

type TikTokMediaData = {
  id: string;
  title: string;
  duration: number;
  cover: string;
  playNoWatermark: string;
  playHDNoWatermark: string;
  playWatermark: string;
  size: number;
  hdSize: number;
  musicTitle: string;
  musicAuthor: string;
  author: TikTokAuthor;
  stats: {
    playCount: number;
    diggCount: number;
    commentCount: number;
    shareCount: number;
    downloadCount: number;
  };
  images: string[];
  isSlideshow: boolean;
};

type ApiResponse = {
  success?: boolean;
  data?: TikTokMediaData;
  error?: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let index = 0;
  let size = bytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function TikTokDownloader() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<TikTokMediaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      setErrorMsg("Vui lòng dán link TikTok trước khi tải.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const response = await fetch("/api/tiktok/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "Không thể lấy dữ liệu video từ TikTok.");
      }

      setResult(json.data);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }

  const primaryMediaUrl = result?.playHDNoWatermark || result?.playNoWatermark || result?.playWatermark || "";
  const downloadHref = primaryMediaUrl
    ? `/api/tiktok/download?url=${encodeURIComponent(primaryMediaUrl)}&filename=${encodeURIComponent(result?.title || "tiktok-video")}`
    : "";

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-[2rem] border border-orange-200/70 bg-white/95 p-5 shadow-[0_24px_60px_rgba(249,115,22,0.16)] backdrop-blur sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">
            TẢI VIDEO TIKTOK
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Tải video TikTok không watermark trực tiếp trong trang
          </h2>
        </div>
        <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
          Hỗ trợ video và slideshow
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-orange-200/70 bg-orange-50/70 p-4">
          <label className="block text-sm font-semibold text-slate-800">
            Dán đường dẫn TikTok vào đây
          </label>
          <input
            value={inputUrl}
            onChange={(event) => setInputUrl(event.target.value)}
            placeholder="https://www.tiktok.com/@user/video/123456789"
            className="mt-3 h-14 w-full rounded-2xl border border-orange-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-4 w-full rounded-2xl border border-orange-300/40 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.2)] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Đang xử lý..." : "Lấy thông tin video"}
          </button>

          {errorMsg ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-slate-100">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Mẹo sử dụng</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            <li>• Dán link video TikTok hoặc link rút gọn như vt.tiktok.com.</li>
            <li>• Hệ thống sẽ lấy thông tin, bản xem trước và đường dẫn tải.</li>
            <li>• Nếu video bị lỗi, hãy thử lại sau vài phút.</li>
          </ul>
        </div>
      </div>

      {result ? (
        <div className="mt-6 grid gap-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img
              src={result.cover || result.author.avatar}
              alt={result.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  {result.isSlideshow ? "Slideshow" : "Video"}
                </span>
                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {formatBytes(result.hdSize || result.size)}
                </span>
              </div>

              <h3 className="mt-3 text-xl font-semibold text-slate-950">{result.title}</h3>
              <p className="mt-2 text-sm text-slate-700">
                Tác giả: <span className="font-semibold text-slate-900">{result.author.nickname}</span> @{result.author.uniqueId}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Nhạc: {result.musicTitle} • {result.musicAuthor}
              </p>

              <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Lượt xem</div>
                  <div className="mt-1 font-semibold text-slate-950">{formatCount(result.stats.playCount)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Thích</div>
                  <div className="mt-1 font-semibold text-slate-950">{formatCount(result.stats.diggCount)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Tải về</div>
                  <div className="mt-1 font-semibold text-slate-950">{formatCount(result.stats.downloadCount)}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {primaryMediaUrl ? (
                <a
                  href={downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-orange-300/50 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(249,115,22,0.2)]"
                >
                  Tải video về
                </a>
              ) : null}
              {primaryMediaUrl ? (
                <a
                  href={primaryMediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800"
                >
                  Xem trực tiếp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
