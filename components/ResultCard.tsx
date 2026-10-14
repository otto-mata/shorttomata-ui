"use client";

import { useEffect, useRef, useState } from "react";
import type { Link } from "@/lib/api";
import { CheckIcon, CopyIcon } from "./Icons";

export function ResultCard({ link }: { link: Link }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const shortUrl = `http://localhost:3000/${link.short_code}`;
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (insecure context); ignore */
    }
  }

  return (
    <div
      role="status"
      className="mx-auto mt-4.5 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 rounded-xl border border-accent-line bg-accent-soft px-4.5 py-3.5 text-left"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate font-mono text-lg font-medium text-accent-ink hover:underline"
        >
          {shortUrl.replace(/^https?:\/\//, "")}
        </a>
        <span className="truncate font-mono text-[13px] text-muted">
          → {link.long_url}
        </span>
      </div>

      <button
        onClick={copy}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-line-strong bg-white px-4 text-sm font-medium"
      >
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
