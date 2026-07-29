import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sandealvip.com";

  // Lấy thời gian hiện tại chuẩn ISO để Google dễ đọc nhất
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      // Trang chủ chứa mã giảm giá Shopee thường cập nhật liên tục mỗi ngày/mỗi giờ
      changeFrequency: "hourly", 
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tai-video-tiktok`, // Chức năng tải video TikTok
      lastModified: currentDate,
      // Tính năng tool ít thay đổi nội dung hơn, nên để daily hoặc weekly
      changeFrequency: "daily", 
      priority: 0.9,
    },
    
    // --- GỢI Ý MỞ RỘNG (Nếu bạn có các trang này) ---
    // Bạn nên có một trang hướng dẫn sử dụng hoặc blog để kéo traffic tự nhiên (Organic Search)
    /*
    {
      url: `${baseUrl}/huong-dan-san-sale-shopee`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/huong-dan-tai-video-tiktok`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }
    */
  ];
}