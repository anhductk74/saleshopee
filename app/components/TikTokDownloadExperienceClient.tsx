"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { UrlInputSection } from "./UrlInputSection";
import { VideoResultCard } from "./VideoResultCard";
import { BatchResultsSection } from "./BatchResultsSection";
import { HistorySection } from "./HistorySection";
import { FeaturesGrid } from "./FeaturesGrid";
import { FAQSection } from "./FAQSection";
import { TikTokMediaData, DownloadHistoryItem, BatchResultItem } from "../types";
import { downloadBatchVideosAsZip } from "../utils/formatters";

const STORAGE_KEY = "tiktok_download_history_v1";
const MAX_HISTORY = 12;

async function fetchTikTokInfo(url: string) {
  const requestUrl = `/api/tiktok/info?url=${encodeURIComponent(url)}`;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(requestUrl, { cache: "no-store" });
      const rawText = await response.text();
      let payload: any = null;

      if (rawText) {
        try {
          payload = JSON.parse(rawText);
        } catch {
          payload = { success: false, error: rawText };
        }
      }

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || `Không thể lấy thông tin video (status ${response.status})`);
      }

      return payload;
    } catch (err) {
      if (attempt === 1) {
        throw err;
      }
    }
  }

  throw new Error("Không thể lấy thông tin video từ link này.");
}

function extractTikTokUrl(input: string): string | null {
  const match = input.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function parseBatchUrls(text: string): string[] {
  return text
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((value) => normalizeUrl(value));
}

function buildMediaData(payload: any, fallbackId: string): TikTokMediaData {
  return {
    id: payload?.id || fallbackId,
    title: payload?.title || "TikTok video",
    duration: payload?.duration || 0,
    cover: payload?.cover || payload?.originCover || "",
    originCover: payload?.originCover,
    playNoWatermark: payload?.playNoWatermark || payload?.playWatermark || "",
    playHDNoWatermark: payload?.playHDNoWatermark || payload?.playNoWatermark || "",
    playWatermark: payload?.playWatermark,
    size: payload?.size,
    hdSize: payload?.hdSize,
    musicUrl: payload?.musicUrl,
    musicTitle: payload?.musicTitle,
    musicAuthor: payload?.musicAuthor,
    musicCover: payload?.musicCover,
    author: {
      id: payload?.author?.id || "",
      uniqueId: payload?.author?.uniqueId || "",
      nickname: payload?.author?.nickname || "TikTok User",
      avatar: payload?.author?.avatar || "",
    },
    stats: {
      playCount: payload?.stats?.playCount || 0,
      diggCount: payload?.stats?.diggCount || 0,
      commentCount: payload?.stats?.commentCount || 0,
      shareCount: payload?.stats?.shareCount || 0,
      downloadCount: payload?.stats?.downloadCount || 0,
    },
    images: payload?.images || [],
    isSlideshow: Boolean(payload?.isSlideshow),
  };
}

export const TikTokDownloadExperience: React.FC = () => {
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [inputUrl, setInputUrl] = useState("");
  const [resultData, setResultData] = useState<TikTokMediaData | null>(null);
  const [batchResults, setBatchResults] = useState<BatchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<DownloadHistoryItem[]>([]);
  const [isBatchZipping, setIsBatchZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchTotalCount, setBatchTotalCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DownloadHistoryItem[];
        setHistoryItems(parsed);
      }
    } catch (err) {
      console.warn("Load history failed", err);
    }
  }, []);

  const saveHistory = (item: DownloadHistoryItem) => {
    const next = [item, ...historyItems.filter((x) => x.id !== item.id)].slice(0, MAX_HISTORY);
    setHistoryItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleSingleSubmit = async (urlValue: string) => {
    const rawUrl = extractTikTokUrl(urlValue) || urlValue;
    const normalized = normalizeUrl(rawUrl);
    if (!normalized) {
      setErrorMsg("Vui lòng nhập đúng đường dẫn TikTok.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResultData(null);

    try {
      const data = await fetchTikTokInfo(normalized);

      const mediaData = buildMediaData(data.data, `${Date.now()}`);
      setResultData(mediaData);
      saveHistory({
        id: mediaData.id,
        title: mediaData.title,
        authorNickname: mediaData.author.nickname,
        authorUniqueId: mediaData.author.uniqueId,
        coverUrl: mediaData.cover,
        downloadedAt: Date.now(),
        mediaData,
      });
    } catch (err) {
      setResultData(null);
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra khi lấy thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchSubmit = async (textValue: string) => {
    const urls = parseBatchUrls(textValue);
    if (urls.length === 0) {
      setErrorMsg("Vui lòng nhập ít nhất một đường dẫn TikTok.");
      return;
    }
    if (urls.length > 100) {
      setErrorMsg("Chỉ hỗ trợ tối đa 100 link trong một lần xử lý.");
      return;
    }

    setMode("batch");
    setIsLoading(true);
    setErrorMsg(null);
    setBatchResults([]);
    setIsProcessingBatch(true);
    setCurrentBatchIndex(0);
    setBatchTotalCount(urls.length);

    try {
      for (let index = 0; index < urls.length; index += 1) {
        const url = urls[index];
        setCurrentBatchIndex(index + 1);

        try {
          const data = await fetchTikTokInfo(url);
          const mediaData = buildMediaData(data.data, `${Date.now()}_${index}`);
          saveHistory({
            id: mediaData.id,
            title: mediaData.title,
            authorNickname: mediaData.author.nickname,
            authorUniqueId: mediaData.author.uniqueId,
            coverUrl: mediaData.cover,
            downloadedAt: Date.now(),
            mediaData,
          });
          setBatchResults((prev) => [...prev, { originalUrl: url, status: "success" as const, data: mediaData }]);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Không thể xử lý link này";
          setBatchResults((prev) => [...prev, { originalUrl: url, status: "error" as const, error: msg }]);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra khi xử lý hàng loạt.";
      setErrorMsg(msg);
    } finally {
      setIsProcessingBatch(false);
      setIsLoading(false);
      setCurrentBatchIndex(urls.length);
    }
  };

  const handleRetryBatchItem = async (index: number) => {
    const item = batchResults[index];
    if (!item) return;
    setBatchResults((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "error", error: "Đang thử lại..." };
      return next;
    });

    try {
      const data = await fetchTikTokInfo(item.originalUrl);
      const mediaData = buildMediaData(data.data, `${Date.now()}_${index}`);
      setBatchResults((prev) => {
        const next = [...prev];
        next[index] = { originalUrl: item.originalUrl, status: "success", data: mediaData };
        return next;
      });
      saveHistory({
        id: mediaData.id,
        title: mediaData.title,
        authorNickname: mediaData.author.nickname,
        authorUniqueId: mediaData.author.uniqueId,
        coverUrl: mediaData.cover,
        downloadedAt: Date.now(),
        mediaData,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể xử lý link này";
      setBatchResults((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], status: "error", error: msg };
        return next;
      });
    }
  };

  const handleDownloadBatchZip = async () => {
    const validItems = batchResults.filter((item) => item.status === "success" && item.data?.playNoWatermark).map((item) => ({ url: item.data!.playNoWatermark, title: item.data!.title, id: item.data!.id }));
    if (validItems.length === 0) return;

    setIsBatchZipping(true);
    setZipProgress(0);
    await downloadBatchVideosAsZip(validItems, (percent) => setZipProgress(percent));
    setIsBatchZipping(false);
    setZipProgress(0);
  };

  const handleDownloadAllVideos = () => {
    batchResults.forEach((item) => {
      if (item.status !== "success" || !item.data) return;
      const url = item.data.playHDNoWatermark || item.data.playNoWatermark;
      if (!url) return;
      const link = document.createElement("a");
      link.href = `/api/tiktok/download?url=${encodeURIComponent(url)}&filename=tiktok_${item.data.id}&ext=mp4`;
      link.setAttribute("download", `tiktok_${item.data.id}.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const resetExperience = () => {
    setResultData(null);
    setBatchResults([]);
    setInputUrl("");
    setErrorMsg(null);
    setIsProcessingBatch(false);
    setCurrentBatchIndex(0);
    setBatchTotalCount(0);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
      <Navbar historyCount={historyItems.length} onOpenHistory={() => setHistoryOpen(true)} />
      <main className="pb-16">
        <UrlInputSection
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          onSubmitUrl={handleSingleSubmit}
          onSubmitBatchText={handleBatchSubmit}
          isLoading={isLoading}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          mode={mode}
          setMode={setMode}
        />

        {batchResults.length > 0 || isProcessingBatch ? (
          <BatchResultsSection
            results={batchResults}
            onRetry={handleRetryBatchItem}
            onDownloadBatchZip={handleDownloadBatchZip}
            onDownloadAllVideos={handleDownloadAllVideos}
            isProcessing={isProcessingBatch}
            currentIndex={currentBatchIndex}
            totalCount={batchTotalCount}
            isZipping={isBatchZipping}
            zipProgress={zipProgress}
            onReset={resetExperience}
          />
        ) : null}

        <FeaturesGrid />

        {resultData ? <VideoResultCard data={resultData} onDownloadStarted={() => {}} onReset={resetExperience} /> : null}

        <FAQSection />
      </main>

      {historyOpen ? (
        <HistorySection
          items={historyItems}
          onClear={() => {
            setHistoryItems([]);
            localStorage.removeItem(STORAGE_KEY);
          }}
          onClose={() => setHistoryOpen(false)}
          onSelectItem={(item) => {
            setResultData(item.mediaData);
            setHistoryOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
