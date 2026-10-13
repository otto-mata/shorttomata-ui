"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useMe } from "@/lib/auth";
import { BranchIcon } from "./Icons";

export function Header() {
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();

  const logout = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["me"] });
      qc.removeQueries({ queryKey: ["links"] });
      window.location.assign("/");
    },
  });

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 md:px-12">
      <Link
        href="/"
        className="font-display text-[26px] font-bold tracking-tight"
      >
        Snipr<span className="text-accent">.</span>
      </Link>

      <nav className="flex flex-wrap items-center gap-7 text-[15px]">
        <a href="#" className="hover:underline">
          Features
        </a>
        <a href="#" className="hover:underline">
          API
        </a>
        <a href="#" className="hover:underline">
          Docs
        </a>

        {isLoading ? (
          <span className="h-11 w-44" aria-hidden />
        ) : me ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/"
              className="flex min-h-11 items-center gap-2 font-medium hover:underline"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={me.avatarUrl}
                alt=""
                width={28}
                height={28}
                className="rounded-full"
              />
              {me.login}
            </Link>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="min-h-11 rounded-lg border border-line-strong bg-white px-4 text-sm font-medium disabled:opacity-60"
            >
              Sign out
            </button>
          </div>
        ) : (
          <a
            href="/api/v1/auth/github"
            className="flex min-h-11 items-center gap-2.5 rounded-lg bg-ink px-[18px] font-medium text-white"
          >
            <BranchIcon />
            Sign in with GitHub
          </a>
        )}
      </nav>
    </header>
  );
}
