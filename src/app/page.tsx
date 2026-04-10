import Link from "next/link";

const tiles = [
  {
    href: "/dashboard",
    eyebrow: "01",
    title: "Practitioner",
    sub: "Pre-session prep, flags, and trends",
    tone: "primary",
  },
  {
    href: "/client-dashboard",
    eyebrow: "02",
    title: "Client View",
    sub: "Highlights, next steps, and progress",
    tone: "soft",
  },
  {
    href: "/intake",
    eyebrow: "03",
    title: "Intake",
    sub: "Onboard a new client",
    tone: "soft",
  },
  {
    href: "/check-in",
    eyebrow: "04",
    title: "Check-In",
    sub: "End-of-session questionnaire",
    tone: "soft",
  },
] as const;

export default function Home() {
  return (
    <div className="canvas-atmosphere min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          {/* Brand */}
          <div className="rise rise-1 flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary-deep flex items-center justify-center shadow-[0_8px_24px_-12px_rgba(60,24,104,0.6)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F8E8A8"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <span className="eyebrow">Meridian / Coaching Studio</span>
          </div>

          {/* Editorial wordmark */}
          <h1 className="rise rise-2 font-display italic text-text-dark leading-[0.95] tracking-tight text-[clamp(3.25rem,9vw,6.5rem)]">
            Meridian.
          </h1>
          <p className="rise rise-3 mt-5 max-w-xl text-base sm:text-lg text-text-mid font-light leading-relaxed">
            A quiet companion for coaches — turning every session check-in into
            a clear, human snapshot of how a client is really doing.
          </p>

          <div className="rise rise-3 gold-seam mt-10 mb-8" />

          {/* 2x2 tile grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tiles.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                className={`rise rise-${4 + (i % 2)} group relative overflow-hidden card-luxe p-5 transition-transform duration-300 hover:-translate-y-0.5`}
              >
                {/* Gold accent rail */}
                <span className="absolute left-0 top-5 bottom-5 w-[2px] bg-accent/70 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-accent transition" />

                <div className="pl-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="eyebrow mb-1.5">{t.eyebrow}</div>
                    <div className="font-display italic text-2xl text-text-dark leading-tight">
                      {t.title}
                    </div>
                    <div className="mt-1 text-sm text-text-mid font-light">
                      {t.sub}
                    </div>
                  </div>
                  <ArrowIcon
                    className={`shrink-0 mt-1.5 transition-transform duration-300 group-hover:translate-x-1 ${
                      t.tone === "primary" ? "text-primary" : "text-text-soft"
                    }`}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Footer row */}
          <div className="rise rise-5 mt-10 flex flex-wrap items-center gap-4 text-xs text-text-soft">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-base-mid bg-white/40 hover:bg-white transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Browse demo scenarios
            </Link>
            <span className="text-text-soft/70 font-light">
              Demo mode — no authentication required
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
