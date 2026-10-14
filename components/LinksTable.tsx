"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, LinkListResponse, type Link } from "@/lib/api";
import { timeAgo } from "@/lib/time";
import { CopyIcon, TrashIcon } from "./Icons";

const COLS = "grid grid-cols-[1.2fr_2fr_0.7fr_0.9fr_0.8fr] gap-4 px-6";

function Row({
  link,
  onDelete,
  deleting,
}: {
  link: Link;
  onDelete: () => void;
  deleting: boolean;
}) {
  const shortUrl = `${window.location.origin}/${link.short_code}`;
  return (
    <div
      className={`${COLS} items-center border-b border-[#EEF0F4] py-4 last:border-b-0`}
    >
      <a
        href={shortUrl}
        target="_blank"
        rel="noreferrer"
        className="truncate font-mono text-[15px] font-medium text-accent-ink hover:underline"
      >
        {shortUrl.replace(/^https?:\/\//, "")}
      </a>
      <span
        className="truncate font-mono text-sm text-muted"
        title={link.long_url}
      >
        {link.long_url}
      </span>
      <span className="text-[15px]">{link.is_active ? "Yes" : "No"}</span>
      <span className="text-sm text-muted">{timeAgo(link.created_at)}</span>
      <span className="text-sm text-muted">{timeAgo(link.expires_at)}</span>
      <span className="flex gap-2">
        <button
          aria-label={`Copy ${shortUrl}`}
          onClick={() => navigator.clipboard.writeText(shortUrl)}
          className="flex size-11 items-center justify-center rounded-lg border border-line-strong bg-white"
        >
          <CopyIcon />
        </button>
        <button
          aria-label={`Delete ${shortUrl}`}
          onClick={onDelete}
          disabled={deleting}
          className="flex size-11 items-center justify-center rounded-lg border border-line-strong bg-white disabled:opacity-50"
        >
          <TrashIcon />
        </button>
      </span>
    </div>
  );
}

export function LinksTable() {
  const qc = useQueryClient();
  const links = useQuery({ queryKey: ["links"], queryFn: api.listLinks });

  const remove = useMutation({
    mutationFn: api.deleteLink,
    onSuccess: (_d, code) => {
      return qc.setQueryData<LinkListResponse>(["links"], (old) => {
        const newList = Object.assign({}, old);
        newList.items = Object.assign(
          [],
          old?.items?.filter((l) => l.short_code !== code),
        );
        newList.count = newList.items.length;
        return newList;
      });
    },
  });

  return (
    <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
      <div className="min-w-[760px]">
        <div
          className={`${COLS} border-b border-line py-3.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-muted`}
        >
          <span>Short link</span>
          <span>Destination</span>
          <span>Active</span>
          <span>Created</span>
          <span>Expiry</span>
        </div>

        {links.isLoading && (
          <p className="px-6 py-10 text-center text-muted">
            Loading your links…
          </p>
        )}

        {links.isError && (
          <p role="alert" className="px-6 py-10 text-center text-red-700">
            Couldn&apos;t load your links.{" "}
            <button onClick={() => links.refetch()} className="underline">
              Try again
            </button>
          </p>
        )}

        {links.data?.items.length === 0 && (
          <p className="px-6 py-10 text-center text-muted">
            No links yet. Shorten one from the home page.
          </p>
        )}

        {links.data?.items.map((link) => (
          <Row
            key={link.short_code}
            link={link}
            deleting={remove.isPending && remove.variables === link.short_code}
            onDelete={() => remove.mutate(link.short_code)}
          />
        ))}
      </div>
    </div>
  );
}
