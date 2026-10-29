import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/manager"] },
    sitemap: "https://brazenpoppy.ca/sitemap.xml",
    host: "https://brazenpoppy.ca",
  };
}
