import React from "react";
import { History, Trash2, Clock3, Download, PlayCircle, X } from "lucide-react";
import { DownloadHistoryItem } from "../types";
import { formatNumber, timeAgo } from "../utils/formatters";

interface HistorySectionProps {
  items: DownloadHistoryItem[];
  onClear: () => void;
  onClose: () => void;
  onSelectItem: (item: DownloadHistoryItem) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ items, onClear, onClose, onSelectItem }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 px-3 py-5 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/60 p-2.5">
              <History className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Lịch sử tải xuống</h3>
              <p className="text-sm text-slate-400">Các video và ảnh bạn đã xử lý gần đây</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onClear} className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/70 px-3 py-2 text-sm font-semibold text-rose-200 transition-all hover:bg-rose-900">
              <Trash2 className="h-4 w-4" />
              Xóa tất cả
            </button>
            <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-slate-800/70 p-2.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-10">
              <Clock3 className="mx-auto h-10 w-10 text-slate-500" />
              <p className="mt-4 text-lg font-semibold text-slate-300">Chưa có lịch sử tải nào</p>
              <p className="mt-2 text-sm text-slate-400">Sau khi tải 1 video hoặc ảnh, các mục này sẽ xuất hiện ở đây để bạn xem lại nhanh.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-md">
                <img src={item.coverUrl || item.mediaData.cover} alt={item.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-400">@{item.authorUniqueId}</p>
                    </div>
                    <span className="rounded-full border border-indigo-500/20 bg-indigo-950/60 px-2.5 py-1 text-[10px] font-semibold text-indigo-300">
                      {timeAgo(item.downloadedAt)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <PlayCircle className="h-3.5 w-3.5 text-cyan-400" />
                      {formatNumber(item.mediaData.stats.playCount)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Download className="h-3.5 w-3.5 text-emerald-400" />
                      {item.mediaData.isSlideshow ? `${item.mediaData.images?.length || 0} ảnh` : "Video"}
                    </span>
                  </div>

                  <button type="button" onClick={() => onSelectItem(item)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-950/70 px-3 py-2.5 text-sm font-semibold text-indigo-200 transition-all hover:bg-indigo-900">
                    <Download className="h-4 w-4" />
                    Xem lại & tải tiếp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
