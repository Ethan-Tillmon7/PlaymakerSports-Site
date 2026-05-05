interface AnnouncementBarProps {
  message?: string;
  highlight?: string;
}

export function AnnouncementBar({
  highlight = 'Now booking',
  message = 'Summer 2026 tournaments — Acadiana & Gulf Coast',
}: AnnouncementBarProps) {
  return (
    <div className="bg-pm-black text-white">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 h-9 flex items-center justify-between font-mono text-[10.5px] tracking-[0.1em] uppercase">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 bg-pm-yellow rounded-full" />
          <span className="text-pm-yellow">{highlight}</span>
          <span className="text-white/70 hidden sm:inline">{message}</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-white/55">
          <a href="/about" className="hover:text-white">Contact us</a>
          <a href="/apparel" className="hover:text-white">View apparel ↗</a>
        </div>
      </div>
    </div>
  );
}
