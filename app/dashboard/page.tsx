"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LinksTable } from "@/components/LinksTable";
import { useMe } from "@/lib/auth";

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
        <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight">
          Your links
        </h1>
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
