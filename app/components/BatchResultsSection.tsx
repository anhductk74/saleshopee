import React from "react";
import { AlertCircle, CheckCircle2, RefreshCw, Download, FileArchive, Film, Loader2, PlayCircle, Clock3 } from "lucide-react";
import { BatchResultItem } from "../types";
import { formatNumber } from "../utils/formatters";

interface BatchResultsSectionProps {
  results: BatchResultItem[];
  onRetry: (index: number) => void;
  onDownloadBatchZip: () => void;
  onDownloadAllVideos: () => void;
  isProcessing?: boolean;
  currentIndex?: number;
  totalCount?: number;
  isZipping?: boolean;
  zipProgress?: number;
  onReset?: () => void;
}

export const BatchResultsSection: React.FC<BatchResultsSectionProps> = ({
  results,
  onRetry,
  onDownloadBatchZip,
  onDownloadAllVideos,
  isProcessing,
  currentIndex,
  totalCount,
  isZipping,
  zipProgress,
  onReset,
}) => {
  const successCount = results.filter((item) => item.status === "success").length;
  const failedCount = results.filter((item) => item.status === "error").length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-3 pb-10">
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-slate-950/90 via-indigo-950/70 to-slate-950/90 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-2">
                  <Film className="h-4 w-4 text-indigo-300" />
                </div>
                <h3 className="text-lg font-bold text-white">Kết quả xử lý hàng loạt</h3>
              </div>
              <p className="text-sm text-slate-400">
                Đã xử lý {successCount}/{results.length} link. Mỗi card dưới đây sẽ hiện ngay sau khi xử lý xong.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onDownloadBatchZip} className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-950/80 px-4 py-2 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-900">
                <FileArchive className="h-4 w-4" />
                {isZipping ? `Đang nén ZIP... ${zipProgress}%` : "Tải ZIP tất cả video"}
              </button>
              <button type="button" onClick={onDownloadAllVideos} className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-950/80 px-4 py-2 text-sm font-semibold text-indigo-200 transition-all hover:bg-indigo-900">
                <Download className="h-4 w-4" />
                Tải tất cả video
              </button>
              {onReset ? (
                <button type="button" onClick={onReset} className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700">
                  Xóa kết quả
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {isProcessing ? (
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-300 sm:px-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <span>
                Đang xử lý link {Math.min((currentIndex ?? 0) + 1, totalCount ?? results.length)}/{totalCount ?? results.length}...
              </span>
            </div>
            <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
              Tiến trình từng link
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2">
          {results.map((item, index) => {
            const isSuccess = item.status === "success";
            const thumbnail = item.data?.cover || item.data?.originCover;

            return (
              <div key={`${item.originalUrl}-${index}`} className={`overflow-hidden rounded-[24px] border transition-all ${isSuccess ? "border-emerald-500/20 bg-emerald-950/20 shadow-lg shadow-emerald-950/20" : "border-rose-500/20 bg-rose-950/20 shadow-lg shadow-rose-950/20"}`}>
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isSuccess ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-rose-400" />}
                    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isSuccess ? "text-emerald-300" : "text-rose-300"}`}>
                      {isSuccess ? "Hoàn tất" : "Chờ / lỗi"}
                    </span>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isSuccess ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                    {isSuccess ? "Thành công" : "Lỗi"}
                  </span>
                </div>

                <div className="p-4">
                  {thumbnail ? (
                    <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
                      <img src={thumbnail} alt={item.data?.title || "Video thumbnail"} className="h-20 w-full object-cover sm:h-24" />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-20 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50 text-xs text-slate-500 sm:h-24">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Chưa có thumbnail</span>
                      </div>
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-white">{item.data?.title || item.originalUrl}</p>
                    <p className="mt-1 break-all text-xs text-slate-400">{item.originalUrl}</p>
                  </div>

                  {isSuccess && item.data ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.data.duration > 0 ? `${Math.floor(item.data.duration / 60)}:${String(item.data.duration % 60).padStart(2, "0")}` : "—"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1">
                          <PlayCircle className="h-3.5 w-3.5" />
                          {formatNumber(item.data.stats.playCount)} lượt xem
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onRetry(index)} className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/70 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-all hover:bg-amber-900">
                          <RefreshCw className="h-3.5 w-3.5" /> Thử lại
                        </button>
                        <button type="button" onClick={() => window.open(item.data?.playHDNoWatermark || item.data?.playNoWatermark, "_blank")} className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/70 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition-all hover:bg-indigo-900">
                          <Download className="h-3.5 w-3.5" /> Tải ngay
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-400">
                      <p className="font-medium text-rose-300">{item.error || "Không thể lấy dữ liệu từ link này."}</p>
                      <div className="mt-3">
                        <button type="button" onClick={() => onRetry(index)} className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/70 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-all hover:bg-amber-900">
                          <RefreshCw className="h-3.5 w-3.5" /> Thử lại link này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
