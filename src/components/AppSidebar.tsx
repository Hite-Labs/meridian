"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { DEMO_SCENARIOS } from "@/lib/demo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: BarChartIcon },
  { label: "Client Intake", href: "/intake", icon: ClipboardIcon },
  { label: "Session Check-In", href: "/check-in", icon: MessageCircleIcon },
];

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const clientId = searchParams.get("clientId") ?? DEMO_SCENARIOS[0].clientId;
  const currentScenario =
    DEMO_SCENARIOS.find((s) => s.clientId === clientId) ?? DEMO_SCENARIOS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(e.target as Node)
      ) {
        setSwitcherOpen(false);
      }
    }
    if (switcherOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [switcherOpen]);

  const badgeColor: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-300",
    red: "bg-red-500/20 text-red-300",
    amber: "bg-amber-500/20 text-amber-300",
    green: "bg-green-500/20 text-green-300",
  };

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <CompassIcon />
        </div>
        <span className="text-lg font-semibold tracking-tight">Meridian</span>
      </div>

      {/* Client switcher */}
      <div className="px-3 mb-4" ref={switcherRef}>
        <button
          onClick={() => setSwitcherOpen(!switcherOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium shrink-0">
            {currentScenario.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {currentScenario.name}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {currentScenario.subtitle}
            </div>
          </div>
          <ChevronIcon open={switcherOpen} />
        </button>

        {switcherOpen && (
          <div className="mt-1 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden py-1">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  router.push(`/dashboard?clientId=${scenario.clientId}`);
                  setSwitcherOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-700 transition-colors ${
                  scenario.clientId === clientId ? "bg-slate-700/50" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium shrink-0">
                  {scenario.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {scenario.name}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                    badgeColor[scenario.color] ?? badgeColor.blue
                  }`}
                >
                  {scenario.subtitle}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={
                item.href === "/dashboard"
                  ? `/dashboard?clientId=${clientId}`
                  : item.href
              }
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <item.icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-800 mt-auto">
        <Link
          href="/demo"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <GridIcon />
          Demo Scenarios
        </Link>
      </div>
    </aside>
  );
}

export default function AppSidebar() {
  return (
    <Suspense>
      <SidebarInner />
    </Suspense>
  );
}

// --- Inline SVG Icons (16x16) ---

function CompassIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function MessageCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
