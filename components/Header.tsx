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
      qc.setQueryData(["me"], null);
      qc.removeQueries({ queryKey: ["links"] });
    },
  });

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 border-b border-line px-4 sm:px-6 py-5 md:px-12">
      <Link
        href="/"
        className="font-display text-[26px] font-bold tracking-tight"
      >
        sh<span className="text-accent">o</span>r
        <span className="text-accent">ttomata</span>
      </Link>

      <nav className="flex flex-wrap items-center gap-7 text-[15px]">
        {isLoading ? (
          <span className="h-11 w-44" aria-hidden />
        ) : me ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/"
              className="flex min-h-11 items-center gap-2 font-medium hover:underline"
            >
              Dashboard
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
