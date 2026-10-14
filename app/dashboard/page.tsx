"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LinksTable } from "@/components/LinksTable";
import { useMe } from "@/lib/auth";
import { ShortenForm } from "@/components/ShortenForm";

export default function Dashboard() {
  const router = useRouter();
  const { data: me, isError, isLoading } = useMe();

  // Client-side guard only; the Go API enforces auth for real.
  useEffect(() => {
    if (isError) router.replace("/");
  }, [isError, router]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-280 px-6 pb-16 pt-12">
        <h2 className="mb-2 md:mb-6 font-display text-[28px] font-semibold tracking-tight">
          Shorten a new link
        </h2>
        <ShortenForm mute={true} />
        <hr className="my-4 text-line" />
        <h2 className="mb-2 md:mb-6 font-display text-[28px] font-semibold tracking-tight">
          Your links
        </h2>
        {isLoading || !me ? (
          <p className="text-muted">Checking your session…</p>
        ) : (
          <LinksTable />
        )}
      </main>
      <Footer />
    </>
  );
}
