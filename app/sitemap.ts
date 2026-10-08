import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sandealvip.com";

  return [
    {
      url: baseUrl,
    },
  ];
}