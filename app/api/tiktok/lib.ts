function extractTikTokUrl(text: string): string | null {
  if (!text) return null;
  const urlRegex = /(https?:\/\/(?:www\.|vt\.|vm\.|v\.|m\.|t\.)?tiktok\.com\/[^\s,;"']+)/gi;
  const match = text.match(urlRegex);
  if (match?.[0]) return match[0];

  const bareRegex = /((?:www\.|vt\.|vm\.|v\.|m\.|t\.)?tiktok\.com\/[^\s,;"']+)/gi;
  const bareMatch = text.match(bareRegex);
  return bareMatch?.[0] ? `https://${bareMatch[0]}` : null;
}

function normalizeTikTokUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function fixUrl(value?: string) {
  if (!value) return "";
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `https://www.tikwm.com${value}`;
  return value;
}

async function resolveTikTokUrl(value: string): Promise<string> {
  const normalized = normalizeTikTokUrl(value);
  if (!normalized.includes("tiktok.com")) return normalized;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(normalized, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    const finalUrl = response.url || normalized;
    return normalizeTikTokUrl(extractTikTokUrl(finalUrl) || finalUrl);
  } catch {
    return normalized;
  } finally {
    clearTimeout(timeoutId);
  }
}

function formatTikWMData(data: any) {
  const images: string[] = Array.isArray(data.images) ? data.images : [];
  const isSlideshow = images.length > 0;
  const playUrl = data.play || data.play_url || data.play_addr?.url_list?.[0] || data.hdplay || data.play_hd || data.wmplay;
  const hdPlayUrl = data.hdplay || data.play_hd || data.play || data.play_url || data.play_addr?.url_list?.[0] || data.wmplay;

  return {
    id: data.id || String(Date.now() + Math.random()),
    title: data.title || "Video TikTok",
    duration: data.duration || 0,
    cover: fixUrl(data.cover || data.origin_cover),
    originCover: fixUrl(data.origin_cover || data.cover),
    playNoWatermark: fixUrl(playUrl),
    playHDNoWatermark: fixUrl(hdPlayUrl),
    playWatermark: fixUrl(data.wmplay || data.play_watermark),
    size: data.size || 0,
    hdSize: data.hd_size || 0,
    musicUrl: fixUrl(data.music || data.music_url || data.music_info?.play_url),
    musicTitle: data.music_info?.title || data.music_title || "Nhạc nền gốc TikTok",
    musicAuthor: data.music_info?.author || data.music_author || data.author?.nickname || "TikTok Creator",
    musicCover: fixUrl(data.music_info?.cover || data.music_cover || data.author?.avatar),
    author: {
      id: data.author?.id || "",
      uniqueId: data.author?.unique_id || data.author?.uniqueId || "tiktok_user",
      nickname: data.author?.nickname || "Người dùng TikTok",
      avatar: fixUrl(data.author?.avatar),
    },
    stats: {
      playCount: data.play_count || 0,
      diggCount: data.digg_count || 0,
      commentCount: data.comment_count || 0,
      shareCount: data.share_count || 0,
      downloadCount: data.download_count || 0,
    },
    images: images.map((img) => fixUrl(img)),
    isSlideshow,
  };
}

async function fetchTikWM(tiktokUrl: string) {
  const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
  const resolvedUrl = await resolveTikTokUrl(normalizedUrl);
  const attempts = [
    {
      url: "https://www.tikwm.com/api/",
      options: {
        method: "POST" as const,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams({ url: resolvedUrl, hd: "1" }),
      },
    },
    {
      url: `https://www.tikwm.com/api/?url=${encodeURIComponent(resolvedUrl)}&hd=1`,
      options: {
        method: "GET" as const,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/javascript, */*; q=0.01",
        },
      },
    },
  ];

  for (const attempt of attempts) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(attempt.url, { ...attempt.options, signal: controller.signal } as RequestInit);
      if (!response.ok) continue;
      const text = await response.text();
      if (!text) continue;
      const parsed = JSON.parse(text);
      if (parsed?.code === 0 || parsed?.data) return parsed;
    } catch {
      // continue to fallback attempt
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;
}

export { extractTikTokUrl, normalizeTikTokUrl, fixUrl, formatTikWMData, fetchTikWM, resolveTikTokUrl };
