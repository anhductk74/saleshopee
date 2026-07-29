import JSZip from "jszip";

export function formatNumber(num: number): string {
  if (!num || Number.isNaN(num)) return "0";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return num.toLocaleString("vi-VN");
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export async function downloadImagesAsZip(
  images: string[],
  postTitle: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folderName = postTitle.slice(0, 30).replace(/[^a-zA-Z0-9_\-À-ÿ]/g, "_") || "tiktok_photos";
  const imageFolder = zip.folder(folderName);

  let completed = 0;
  for (let i = 0; i < images.length; i++) {
    const imgUrl = images[i];
    try {
      const proxyUrl = `/api/tiktok/download?url=${encodeURIComponent(imgUrl)}&filename=photo_${i + 1}&ext=jpg`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) continue;
      const blob = await resp.blob();
      const filename = `anh_${String(i + 1).padStart(2, "0")}.jpg`;
      imageFolder?.file(filename, blob);
    } catch (err) {
      console.error(`Error downloading image ${i}:`, err);
    }
    completed += 1;
    if (onProgress) {
      onProgress(Math.round((completed / images.length) * 100));
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(content);
  downloadLink.download = `${folderName}_bo_anh.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export async function downloadBatchVideosAsZip(
  items: { url: string; title: string; id: string }[],
  onProgress?: (percent: number, current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folderName = "TikTok_Batch_Videos";
  const videoFolder = zip.folder(folderName);

  let completed = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const proxyUrl = `/api/tiktok/download?url=${encodeURIComponent(item.url)}&filename=video_${item.id}&ext=mp4`;
      const resp = await fetch(proxyUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        const safeTitle = (item.title || `video_${i + 1}`)
          .slice(0, 35)
          .replace(/[^a-zA-Z0-9_\-À-ÿ]/g, "_");
        const filename = `${String(i + 1).padStart(2, "0")}_${safeTitle}_${item.id}.mp4`;
        videoFolder?.file(filename, blob);
      }
    } catch (err) {
      console.error(`Error downloading video ${i} for zip:`, err);
    }
    completed += 1;
    if (onProgress) {
      onProgress(Math.round((completed / items.length) * 100), completed, items.length);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(content);
  downloadLink.download = `TTSavePro_Batch_${items.length}_Videos.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
