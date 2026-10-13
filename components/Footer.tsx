export function Footer() {
  return (
    <footer className="mt-auto flex flex-wrap justify-between gap-4 border-t border-line px-6 py-7 text-sm text-muted md:px-12">
      <span>© Snipr</span>
      <span className="flex gap-6">
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          GitHub
        </a>
      </span>
    </footer>
  );
}
