"use client";

export default function MobileHeader({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  return (
    <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-primary-deep text-white shrink-0">
      <button
        type="button"
        onClick={onMenuToggle}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
        <span className="text-base font-display italic tracking-tight">Meridian</span>
      </div>
    </header>
  );
}
