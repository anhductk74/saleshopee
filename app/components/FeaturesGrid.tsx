import React from "react";
import { Film, Layers3, DownloadCloud, Music4, Images, ShieldCheck } from "lucide-react";

const features = [
  { icon: Film, title: "Video HD Không Logo", description: "Tải video TikTok chất lượng cao, rõ nét và không logo." },
  { icon: Layers3, title: "Tải Hàng Loạt", description: "Nhập nhiều link cùng lúc, xử lý tuần tự và xem kết quả từng mục." },
  { icon: DownloadCloud, title: "Tải Nhanh", description: "Giao diện tối ưu, thao tác đơn giản và tốc độ xử lý nhanh." },
  { icon: Music4, title: "MP3 & Nhạc", description: "Xuất audio riêng cho video hoặc tải nội dung âm thanh trực tiếp." },
  { icon: Images, title: "Bộ Ảnh Slideshow", description: "Tải cả bộ ảnh dạng slideshow hoặc nén thành file ZIP." },
  { icon: ShieldCheck, title: "An Toàn", description: "Không cần cài đặt thêm, hỗ trợ trực tuyến và tận dụng proxy download." },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-2">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-indigo-500/30 hover:bg-slate-800/70">
              <div className="mb-4 inline-flex rounded-2xl border border-indigo-500/20 bg-indigo-950/70 p-2.5 text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-base font-semibold text-white">{feature.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
