export interface TikTokAuthor {
  id: string;
  uniqueId: string;
  nickname: string;
  avatar: string;
}

export interface TikTokStats {
  playCount: number;
  diggCount: number;
  commentCount: number;
  shareCount: number;
  downloadCount: number;
}

export interface TikTokMediaData {
  id: string;
  title: string;
  duration: number;
  cover: string;
  originCover?: string;
  playNoWatermark: string;
  playHDNoWatermark?: string;
  playWatermark?: string;
  size?: number;
  hdSize?: number;
  musicUrl?: string;
  musicTitle?: string;
  musicAuthor?: string;
  musicCover?: string;
  author: TikTokAuthor;
  stats: TikTokStats;
  images?: string[];
  isSlideshow: boolean;
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  authorNickname: string;
  authorUniqueId: string;
  coverUrl: string;
  downloadedAt: number;
  mediaData: TikTokMediaData;
}

export interface BatchResultItem {
  originalUrl: string;
  status: "success" | "error";
  data?: TikTokMediaData;
  error?: string;
}

export interface BatchResponse {
  success: boolean;
  total: number;
  successCount: number;
  items: BatchResultItem[];
  isProcessing?: boolean;
  currentIndex?: number;
}
