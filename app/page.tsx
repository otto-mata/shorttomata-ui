"use client";

import { FormEvent, useMemo, useState } from "react";

type ShortLink = {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
};

const BASE_URL = "https://sho.rt";

const mockShortenUrl = async (
  originalUrl: string,
  customAlias?: string,
): Promise<ShortLink> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const cleanAlias = customAlias?.trim();
  const shortCode = cleanAlias || Math.random().toString(36).slice(2, 8);

  return {
    id: crypto.randomUUID(),
    originalUrl,
    shortCode,
    shortUrl: `${BASE_URL}/${shortCode}`,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [recentLinks, setRecentLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState("");

  const totalLinks = recentLinks.length;
  const totalClicks = useMemo(
    () => recentLinks.reduce((sum, link) => sum + link.clicks, 0),
    [recentLinks],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setCopiedLink("");

    const normalizedUrl = url.trim();
    if (!normalizedUrl) {
      setError("Please enter a URL.");
      return;
    }

    try {
      const parsed = new URL(normalizedUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("URL must start with http:// or https://");
        return;
      }
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      const shortened = await mockShortenUrl(normalizedUrl, customAlias);
      setRecentLinks((previous) => [shortened, ...previous].slice(0, 5));
      setCustomAlias("");
      setUrl("");
    } catch {
      setError("Unable to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedLink(shortUrl);
    } catch {
      setError("Copy failed. Please copy the link manually.");
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-10">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Shorttomata
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            URL Shortener
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Turn long links into memorable short URLs. This UI currently uses a
            mock API response.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="url-input"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              Long URL
            </label>
            <input
              id="url-input"
              type="url"
              placeholder="https://example.com/very/long/link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-4 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-100/10"
              required
            />
          </div>

          <div>
            <label
              htmlFor="alias-input"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              Custom alias (optional)
            </label>
            <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
              <span className="border-r border-zinc-300 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                {BASE_URL}/
              </span>
              <input
                id="alias-input"
                type="text"
                value={customAlias}
                onChange={(event) => setCustomAlias(event.target.value)}
                placeholder="my-campaign"
                className="w-full rounded-r-lg px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-4 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-100/10"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recent links
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {totalLinks} links · {totalClicks} total clicks
            </p>
          </div>

          {recentLinks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No links yet. Create your first short URL above.
            </div>
          ) : (
            <ul className="space-y-3">
              {recentLinks.map((link) => (
                <li
                  key={link.id}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {link.originalUrl}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <a
                      href={link.shortUrl}
                      className="text-sm font-semibold text-zinc-900 underline underline-offset-2 dark:text-zinc-100"
                    >
                      {link.shortUrl}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(link.shortUrl)}
                      className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      {copiedLink === link.shortUrl ? "Copied" : "Copy"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
