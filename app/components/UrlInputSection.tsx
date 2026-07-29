import React, { useState } from "react";
import { Clipboard, X, Search, Sparkles, Loader2, AlertCircle, Link2, CheckCircle2, Layers, Film } from "lucide-react";

interface UrlInputSectionProps {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  onSubmitUrl: (url: string) => void;
  onSubmitBatchText: (text: string) => void;
  isLoading: boolean;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  mode: "single" | "batch";
  setMode: (mode: "single" | "batch") => void;
}

export const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  inputUrl,
  setInputUrl,
  onSubmitUrl,
  onSubmitBatchText,
  isLoading,
  errorMsg,
  setErrorMsg,
  mode,
  setMode,
}) => {
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
        setErrorMsg(null);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch (err) {
      console.warn("Clipboard read failed:", err);
    }
  };

  const handleClear = () => {
    setInputUrl("");
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg(mode === "single" ? "Vui lòng dán liên kết TikTok!" : "Vui lòng dán danh sách link TikTok (mỗi dòng 1 link)!");
      return;
    }
    if (mode === "single") {
      onSubmitUrl(inputUrl.trim());
    } else {
      onSubmitBatchText(inputUrl.trim());
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setMode("single");
    setInputUrl(sampleUrl);
    setErrorMsg(null);
    onSubmitUrl(sampleUrl);
  };

  const handleSelectBatchSample = () => {
    setMode("batch");
    const batchText = `https://vt.tiktok.com/ZSjR3y89M/\nhttps://www.tiktok.com/@tiktok/video/7311100112345678901`;
    setInputUrl(batchText);
    setErrorMsg(null);
    onSubmitBatchText(batchText);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Tải Video TikTok Không Dính Logo 1080p HD</span>
        </div>
        <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          Tải Video TikTok <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Không Có Logo & Hình Mờ
          </span>
        </h2>
        <p className="mx-auto max-w-xl text-sm text-slate-400 sm:text-base">
          Nhanh chóng, miễn phí và giữ nguyên chất lượng Full HD chỉ với một cú nhấp chuột. Hỗ trợ tải từng video hoặc tải hàng loạt nhiều link cùng lúc.
        </p>

        <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-slate-900/80 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setMode("single");
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${mode === "single" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"}`}
          >
            <Film className="h-4 w-4" />
            <span>Tải 1 Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("batch");
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${mode === "batch" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"}`}
          >
            <Layers className="h-4 w-4" />
            <span>Tải Hàng Loạt (Nhiều Link)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="group relative">
        <div className="w-full rounded-3xl border border-white/10 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl transition-all sm:p-3">
          {mode === "single" ? (
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <div className="relative flex w-full flex-1 items-center">
                <div className="pl-4 pr-2 text-slate-500 transition-colors group-focus-within:text-indigo-400">
                  <Link2 className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  id="input-tiktok-url"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Dán liên kết video TikTok tại đây... (VD: https://vt.tiktok.com/...)"
                  disabled={isLoading}
                  className="w-full bg-transparent py-4 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none sm:text-lg"
                  autoComplete="off"
                />

                {inputUrl && !isLoading ? (
                  <button type="button" onClick={handleClear} className="mr-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200" title="Xóa ô nhập">
                    <X className="h-4 w-4" />
                  </button>
                ) : null}

                {!inputUrl ? (
                  <button
                    type="button"
                    onClick={handlePaste}
                    id="btn-paste-clipboard"
                    className="mr-2 hidden items-center gap-1.5 whitespace-nowrap rounded-xl border border-indigo-500/30 bg-indigo-950/80 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-900/80 active:scale-95 sm:flex"
                  >
                    {pasteSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Đã dán</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Dán link</span>
                      </>
                    )}
                  </button>
                ) : null}
              </div>

              <button
                type="submit"
                id="btn-submit-download"
                disabled={isLoading || !inputUrl.trim()}
                className="flex min-w-[150px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>TẢI XUỐNG</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-2">
              <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                <span>Dán nhiều đường dẫn TikTok (mỗi link nằm trên 1 dòng):</span>
                {!inputUrl ? (
                  <button type="button" onClick={handlePaste} className="flex items-center gap-1 font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
                    <Clipboard className="h-3 w-3" /> Dán từ clipboard
                  </button>
                ) : null}
              </div>

              <textarea
                id="input-batch-urls"
                rows={4}
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={`https://vt.tiktok.com/ZSjR3y89M/\nhttps://www.tiktok.com/@tiktok/video/7311100112345678901\nhttps://www.tiktok.com/@user/video/123456789...`}
                disabled={isLoading}
                className="w-full resize-y rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500/80 focus:outline-none"
              />

              <div className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
                <span className="text-xs text-slate-400">
                  Hệ thống xử lý <strong className="text-indigo-300">tuần tự từng link một</strong> (tối đa 100 link) và hiển thị trực tiếp ngay khi vừa xong.
                </span>

                <button
                  type="submit"
                  id="btn-submit-batch-download"
                  disabled={isLoading || !inputUrl.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      <span>Đang xử lý hàng loạt...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="h-5 w-5" />
                      <span>XỬ LÝ TẤT CẢ LINK</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {errorMsg ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/60 p-4 text-sm text-rose-200 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Không thể xử lý</p>
            <p className="mt-0.5 text-xs opacity-90">{errorMsg}</p>
          </div>
          <button type="button" onClick={() => setErrorMsg(null)} className="rounded-lg p-1 text-rose-400 hover:bg-rose-900/50">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Mẫu thử nghiệm:</span>
        <button type="button" onClick={() => handleSelectSample("https://vt.tiktok.com/ZSjR3y89M/")} className="font-medium text-indigo-400 underline decoration-indigo-400/40 underline-offset-2 transition-colors hover:text-indigo-300">
          Link mẫu 1 Video
        </button>
        <span>•</span>
        <button type="button" onClick={handleSelectBatchSample} className="font-medium text-cyan-400 underline decoration-cyan-400/40 underline-offset-2 transition-colors hover:text-cyan-300">
          Thử xử lý 2 link hàng loạt
        </button>
      </div>
    </div>
  );
};
