import React from "react";
import { HelpCircle, ShieldCheck, Zap, Sparkles, Download } from "lucide-react";

export const FAQSection: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-3">
      <div className="rounded-3xl border border-white/10 bg-slate-900/55 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-950/70 p-2.5">
            <HelpCircle className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Câu hỏi thường gặp</h3>
            <p className="text-sm text-slate-400">Tất cả điều bạn cần biết để dùng công cụ tải video TikTok</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-semibold">An toàn</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">Chúng tôi sử dụng kết nối an toàn và không lưu trữ nội dung của bạn trên máy chủ lâu dài.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-indigo-300">
              <Zap className="h-4 w-4" />
              <span className="font-semibold">Nhanh và tiện</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">Hỗ trợ tải 1 video hoặc hàng loạt nhiều link, hiển thị kết quả ngay khi xử lý xong từng mục.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-amber-300">
              <Download className="h-4 w-4" />
              <span className="font-semibold">Đa định dạng</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">Bạn có thể tải video HD, MP3 và bộ ảnh slideshow riêng hoặc theo file ZIP.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/40 p-4 text-sm text-indigo-100">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-indigo-300" />
            Mẹo dùng tốt nhất
          </div>
          <p className="mt-2 leading-6 text-indigo-200/90">Dán đúng đường dẫn TikTok và hãy giữ kết nối mạng ổn định. Nếu link lỗi, hãy dùng nút thử lại hoặc đổi sang chế độ tải hàng loạt để xử lý nhiều link cùng lúc.</p>
        </div>
      </div>
    </section>
  );
};
