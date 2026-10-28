import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const siteUrl = "https://moyeorak.site";

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

function expectMetaTag(html: string, attributes: string[]) {
  const pattern = attributes
    .map((attribute) => attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\s\\S]*");

  expect(html).toMatch(new RegExp(`<meta[\\s\\S]*${pattern}[\\s\\S]*/>`));
}

describe("SEO static configuration", () => {
  it("declares the production URL and absolute share image URLs in index.html", () => {
    const indexHtml = readProjectFile("index.html");

    expect(indexHtml).toContain(`<link rel="canonical" href="${siteUrl}/" />`);
    expectMetaTag(indexHtml, [`property="og:url"`, `content="${siteUrl}/"`]);
    expectMetaTag(indexHtml, [
      `property="og:image"`,
      `content="${siteUrl}/static/images/share.png"`,
    ]);
    expectMetaTag(indexHtml, [
      `name="twitter:image"`,
      `content="${siteUrl}/static/images/share.png"`,
    ]);
  });

  it("allows the public landing page and points crawlers to the sitemap", () => {
    const robotsTxt = readProjectFile("public/robots.txt");

    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain("Allow: /");
    expect(robotsTxt).toContain("Disallow: /new/");
    expect(robotsTxt).toContain("Disallow: /meetings/");
    expect(robotsTxt).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  });

  it("publishes only the landing page in the sitemap", () => {
    const sitemapXml = readProjectFile("public/sitemap.xml");

    expect(sitemapXml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(sitemapXml).toContain(`<loc>${siteUrl}/</loc>`);
    expect(sitemapXml).not.toContain("/new/");
    expect(sitemapXml).not.toContain("/meetings/");
  });

  it("marks Cloudflare preview and app flow routes as noindex", () => {
    const headers = readProjectFile("public/_headers");

    expect(headers).toContain("https://:project.pages.dev/*");
    expect(headers).toContain("https://:version.:project.pages.dev/*");
    expect(headers).toContain("/new/*");
    expect(headers).toContain("/meetings/*");
    expect(headers).toContain("X-Robots-Tag: noindex");
    expect(headers).toContain("X-Robots-Tag: noindex, nofollow");
  });
});
