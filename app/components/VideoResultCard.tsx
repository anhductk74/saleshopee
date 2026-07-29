import React, { useState } from "react";
import { TikTokMediaData } from "../types";
import { formatNumber, formatFileSize, formatDuration, downloadImagesAsZip } from "../utils/formatters";
import { Download, Music, Heart, MessageCircle, Share2, Eye, Check, Copy, ChevronLeft, ChevronRight, FileArchive, Film, Sparkles, Play, Pause, RotateCcw } from "lucide-react";

interface VideoResultCardProps {
  data: TikTokMediaData;
  onDownloadStarted?: (type: string) => void;
  onReset?: () => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({ data, onDownloadStarted, onReset }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const copyCaption = () => {
    if (data.title) {
      navigator.clipboard.writeText(data.title);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  const copyDirectLink = () => {
    const link = data.playHDNoWatermark || data.playNoWatermark;
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownload = (mediaUrl: string, filename: string, ext: string, typeName: string) => {
    if (!mediaUrl) return;
    setDownloadingType(typeName);
    if (onDownloadStarted) onDownloadStarted(typeName);

    const downloadEndpoint = `/api/tiktok/download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(filename)}&ext=${ext}`;
    const link = document.createElement("a");
    link.href = downloadEndpoint;
    link.setAttribute("download", `${filename}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingType(null);
    }, 2500);
  };

  const handleDownloadZipImages = async () => {
    if (!data.images || data.images.length === 0) return;
    try {
      setIsZipping(true);
      setZipProgress(0);
      await downloadImagesAsZip(data.images, data.title, (percent) => {
        setZipProgress(percent);
      });
    } catch (err) {
      console.error("Error zipping images:", err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <img
              src={data.author.avatar || data.cover}
              alt={data.author.nickname}
              className="h-12 w-12 rounded-2xl border border-indigo-500/40 object-cover shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/100/100";
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{data.author.nickname}</h3>
                <span className="rounded-md border border-indigo-500/20 bg-indigo-950/60 px-2 py-0.5 font-mono text-xs text-indigo-300">@{data.author.uniqueId}</span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span>TikTok Creator</span>
                {data.duration > 0 ? (
                  <>
                    <span>•</span>
                    <span>Thời lượng: {formatDuration(data.duration)}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5" title="Lượt xem">
                <Eye className="h-4 w-4 text-cyan-400" />
                <span>{formatNumber(data.stats.playCount)}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Lượt thích">
                <Heart className="h-4 w-4 fill-rose-400/20 text-rose-400" />
                <span>{formatNumber(data.stats.diggCount)}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Lượt bình luận">
                <MessageCircle className="h-4 w-4 text-teal-400" />
                <span>{formatNumber(data.stats.commentCount)}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Chia sẻ">
                <Share2 className="h-4 w-4 text-indigo-400" />
                <span>{formatNumber(data.stats.shareCount)}</span>
              </div>
            </div>

            {onReset ? (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200 shadow-md transition-all hover:border-rose-500/30 hover:bg-rose-900/40 hover:text-rose-300 active:scale-95"
                title="Xóa kết quả hiện tại để xử lý link mới"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                <span>Nhập Link Mới</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-12">
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            {data.isSlideshow && data.images && data.images.length > 0 ? (
              <div className="flex w-full flex-col items-center">
                <div className="group relative aspect-[3/4] w-full max-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-lg">
                  <img src={data.images[activeImageIdx]} alt={`Slide ${activeImageIdx + 1}`} className="h-full w-full object-contain bg-black/80" />
                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
                    Ảnh {activeImageIdx + 1} / {data.images.length}
                  </div>
                  {data.images.length > 1 ? (
                    <>
                      <button type="button" onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : data.images!.length - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-2 text-white transition-all backdrop-blur-sm hover:bg-indigo-600">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button type="button" onClick={() => setActiveImageIdx((prev) => (prev < data.images!.length - 1 ? prev + 1 : 0))} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-2 text-white transition-all backdrop-blur-sm hover:bg-indigo-600">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}
                </div>
                {data.images.length > 1 ? (
                  <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-2">
                    {data.images.map((img, idx) => (
                      <button key={idx} type="button" onClick={() => setActiveImageIdx(idx)} className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${activeImageIdx === idx ? "scale-105 border-indigo-400" : "border-slate-800 opacity-60 hover:opacity-100"}`}>
                        <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="group relative aspect-[9/16] w-full max-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-xl">
                <video controls poster={data.cover} preload="metadata" className="h-full w-full object-contain" src={data.playHDNoWatermark || data.playNoWatermark}>
                  Trình duyệt của bạn không hỗ trợ xem video trực tiếp.
                </video>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="rounded-xl border border-indigo-500/30 bg-indigo-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  {data.isSlideshow ? "Bài Đăng Bộ Ảnh TikTok" : "Video TikTok HD"}
                </span>
                <button type="button" onClick={copyCaption} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1 text-xs text-slate-300 transition-colors hover:text-white" title="Sao chép tiêu đề video">
                  {copiedCaption ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-medium text-emerald-400">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Sao chép caption</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-200">{data.title || "Không có mô tả video"}</p>

              {data.musicUrl ? (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3.5">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative shrink-0">
                      <img src={data.musicCover || data.author.avatar} alt="Music cover" className="h-10 w-10 rounded-xl border border-slate-700 object-cover" />
                      <button type="button" onClick={toggleAudio} className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-white transition-all hover:bg-black/60">
                        {isPlayingAudio ? <Pause className="h-4 w-4 fill-cyan-400 text-cyan-400" /> : <Play className="ml-0.5 h-4 w-4 fill-white text-white" />}
                      </button>
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-xs font-semibold text-slate-100">{data.musicTitle}</p>
                      <p className="truncate text-[11px] text-slate-400">{data.musicAuthor}</p>
                    </div>
                  </div>
                  <audio ref={audioRef} src={data.musicUrl} onEnded={() => setIsPlayingAudio(false)} className="hidden" />
                  <button
                    type="button"
                    onClick={() => {
                      if (data.musicUrl) {
                        handleDownload(data.musicUrl, `tiktok_music_${data.id}`, "mp3", "Nhạc MP3");
                      }
                    }}
                    disabled={downloadingType === "Nhạc MP3" || !data.musicUrl}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-950/80 px-3.5 py-2 text-xs font-semibold text-teal-300 transition-all hover:bg-teal-900"
                  >
                    <Music className="h-3.5 w-3.5 text-teal-400" />
                    <span>Tải MP3</span>
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Tùy Chọn Tải Về
              </h4>

              {!data.isSlideshow ? (
                <button type="button" onClick={() => handleDownload(data.playHDNoWatermark || data.playNoWatermark, `tiktok_no_watermark_hd_${data.id}`, "mp4", "Video HD Không Logo")} disabled={downloadingType === "Video HD Không Logo"} id="btn-download-hd-no-watermark" className="group flex w-full items-center justify-between rounded-2xl bg-indigo-600 p-4 font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.99]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-extrabold leading-tight">Tải Video Không Logo (HD)</p>
                      <p className="text-[11px] font-normal text-indigo-100/80">Sắc nét nhất • Tải trực tiếp về máy</p>
                    </div>
                  </div>
                  {data.hdSize ? <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs font-mono">{formatFileSize(data.hdSize)}</span> : <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold">1080p HD</span>}
                </button>
              ) : null}

              {data.isSlideshow && data.images && data.images.length > 0 ? (
                <div className="space-y-2">
                  <button type="button" onClick={handleDownloadZipImages} disabled={isZipping} id="btn-download-zip-images" className="flex w-full items-center justify-between rounded-2xl bg-indigo-600 p-4 font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.99]">
                    <div className="flex items-center gap-3">
                      <FileArchive className="h-5 w-5" />
                      <div className="text-left">
                        <p className="text-sm font-extrabold leading-tight">{isZipping ? `Đang nén ZIP... (${zipProgress}%)` : `Tải Trọn Bộ ${data.images.length} Ảnh (File ZIP)`}</p>
                        <p className="text-[11px] font-normal text-indigo-100/80">Nén tất cả ảnh chất lượng gốc</p>
                      </div>
                    </div>
                    <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold">ZIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const currentImage = data.images?.[activeImageIdx];
                      if (currentImage) {
                        handleDownload(currentImage, `tiktok_photo_${activeImageIdx + 1}_${data.id}`, "jpg", "Ảnh Hiện Tại");
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-800/80 p-3.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-cyan-400" />
                      Tải riêng ảnh đang xem ({activeImageIdx + 1}/{data.images?.length || 0})
                    </span>
                    <span className="font-mono text-slate-400">JPG</span>
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
                {data.playNoWatermark ? (
                  <button type="button" onClick={() => handleDownload(data.playNoWatermark, `tiktok_no_watermark_sd_${data.id}`, "mp4", "Video SD Không Logo")} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/80 p-3.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800">
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-cyan-400" /> SD Không Logo
                    </span>
                    <span className="font-mono text-slate-400">MP4</span>
                  </button>
                ) : null}
                <button type="button" onClick={copyDirectLink} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/80 p-3.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800">
                  <span className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-amber-400" /> Sao chép link gốc
                  </span>
                  <span className="font-mono text-slate-400">URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
