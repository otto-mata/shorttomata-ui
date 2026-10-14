import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShortenForm } from "@/components/ShortenForm";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center px-6 pb-16 pt-[88px] text-center">
        <p className="mb-5 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-muted">
          Yet another URL shortening service
        </p>
        <h1 className="max-w-[820px] font-display text-5xl font-bold leading-[1.04] tracking-[-0.03em] md:text-[68px]">
          Long URLs in, <br />
          <span className="text-accent">short(er) links</span> out.
        </h1>
        <p className="mt-6 max-w-[560px] text-[19px] leading-normal text-muted">
          Paste a link, get a short one you can share anywhere.
          <br />
          Sign in to see the links you createed and (one day) name your links
          and see who clicks them.
        </p>
        <div className="mt-10 w-full">
          <ShortenForm mute={false} />
        </div>
      </main>
      <Footer />
    </>
  );
}
