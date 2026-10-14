"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { ResultCard } from "./ResultCard";

export function ShortenForm({ mute }: { mute: boolean }) {
  const [url, setUrl] = useState("");
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: api.createLink,
    onSuccess: () => {
      setUrl("");
      qc.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (url.trim()) create.mutate(url.trim());
        }}
        className="mx-auto flex w-full max-w-3xl flex-col md:flex-row md:flex-wrap gap-2.5"
      >
        <label htmlFor="url" className="sr-only">
          Long URL
        </label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/a/very/long/path?with=params"
          className="min-h-13 md:flex-[1_1_fit-content] px-4 font-mono text-base outline-none rounded-[14px]   border border-line-strong bg-white p-2.5 shadow-[0_8px_24px_rgba(14,17,22,0.06)]"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="min-h-13 rounded-[10px] bg-accent px-7 text-base font-medium text-white disabled:opacity-60"
        >
          {create.isPending ? "Shortening…" : "Shorten link"}
        </button>
      </form>

      {create.error && (
        <p
          role="alert"
          className="mx-auto mt-3 w-full max-w-3xl text-left text-sm text-red-700"
        >
          {create.error.message}
        </p>
      )}
      {create.data && !mute && <ResultCard link={create.data} />}
    </div>
  );
}
