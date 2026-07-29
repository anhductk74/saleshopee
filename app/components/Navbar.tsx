import React from "react";
import Link from "next/link";
import { Download, History, ShieldCheck, Zap, House } from "lucide-react";

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ historyCount, onOpenHistory }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-600 shadow-lg shadow-indigo-500/25">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                TT-Save<span className="text-indigo-400">Pro</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                <Zap className="h-2.5 w-2.5 fill-indigo-400 text-indigo-400" /> Không Logo
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Tải Video & Ảnh Slide TikTok Sắc Nét 100% Miễn Phí
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-300 backdrop-blur-md md:flex">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Tốc độ cao • An toàn 100%</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-md transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white active:scale-95"
            title="Về trang chính"
          >
            <House className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Trang chính</span>
          </Link>

          <button
            type="button"
            onClick={onOpenHistory}
            id="btn-open-history"
            className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-md transition-all duration-200 hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white active:scale-95"
            title="Lịch sử tải xuống"
          >
            <History className="h-4 w-4 text-indigo-400" />
            <span className="hidden sm:inline">Lịch sử</span>
            {historyCount > 0 ? (
              <span className="flex min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {historyCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};
