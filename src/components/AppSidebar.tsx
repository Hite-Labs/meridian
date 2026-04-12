"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import AddClientModal from "./AddClientModal";

interface ClientSummary {
  id: string;
  name: string;
  status: string;
  latestOrs: number | null;
  activeFlagCount: number;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: BarChartIcon },
  { label: "Client View", href: "/client-dashboard", icon: UserIcon },
  { label: "Client Intake", href: "/intake", icon: ClipboardIcon },
  { label: "Session Check-In", href: "/check-in", icon: MessageCircleIcon },
];

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const fetchClients = useCallback(() => {
    setLoadingClients(true);
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients ?? []);
        setLoadingClients(false);
      })
      .catch(() => setLoadingClients(false));
  }, []);

  useEffect(() => {
    fetchClients();
    const onChanged = () => fetchClients();
    window.addEventListener("clients-changed", onChanged);
    return () => window.removeEventListener("clients-changed", onChanged);
  }, [fetchClients]);

  const clientId = searchParams.get("clientId") ?? clients[0]?.id ?? "";
  const currentClient = clients.find((c) => c.id === clientId) ?? clients[0];

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

  function handleClientCreated(client: { id: string; name: string }) {
    setAddModalOpen(false);
    fetchClients();
    router.push(`/dashboard?clientId=${client.id}`);
  }

  return (
    <>
      <aside className="w-60 bg-primary-deep text-white flex flex-col shrink-0 relative">
        {/* Subtle inner light */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 30% at 50% 0%, rgba(196,154,40,0.10) 0%, rgba(196,154,40,0) 70%)",
          }}
        />

        {/* Brand */}
        <div className="relative px-5 pt-6 pb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-[0_4px_14px_-6px_rgba(196,154,40,0.7)]">
            <CompassIcon />
          </div>
          <span className="text-2xl font-display italic tracking-tight leading-none">
            Meridian
          </span>
        </div>

        {/* Gold seam */}
        <div className="relative mx-5 mb-4 gold-seam" />

        {/* Client switcher */}
        <div className="relative px-3 mb-4" ref={switcherRef}>
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary-light/40 flex items-center justify-center text-sm font-medium shrink-0">
              {currentClient?.name?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {loadingClients ? "Loading..." : currentClient?.name ?? "No clients"}
              </div>
              {currentClient && (
                <div className="text-xs text-white/50 truncate capitalize">
                  {currentClient.status}
                  {currentClient.activeFlagCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-danger text-[10px] text-white font-bold">
                      {currentClient.activeFlagCount}
                    </span>
                  )}
                </div>
              )}
            </div>
            <ChevronIcon open={switcherOpen} />
          </button>

          {switcherOpen && (
            <div className="mt-1 rounded-xl bg-primary-deep border border-white/10 overflow-hidden py-1 shadow-lg">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    router.push(`/dashboard?clientId=${client.id}`);
                    setSwitcherOpen(false);
                    onNavigate?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/10 transition-colors ${
                    client.id === clientId ? "bg-white/10" : ""
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary-light/40 flex items-center justify-center text-xs font-medium shrink-0">
                    {client.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {client.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {client.activeFlagCount > 0 && (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-danger text-[10px] text-white font-bold">
                        {client.activeFlagCount}
                      </span>
                    )}
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 capitalize">
                      {client.status}
                    </span>
                  </div>
                </button>
              ))}

              {/* Add Client button inside dropdown */}
              <div className="border-t border-white/10 mt-1 pt-1">
                <button
                  onClick={() => {
                    setSwitcherOpen(false);
                    setAddModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                >
                  <div className="w-7 h-7 rounded-full border border-dashed border-white/30 flex items-center justify-center text-xs shrink-0">
                    <PlusIcon />
                  </div>
                  <span className="text-sm font-medium">Add Client</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="relative flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={
                  item.href === "/client-dashboard"
                    ? `${item.href}?clientId=${clientId}`
                    : item.href
                }
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="relative px-3 pb-4 pt-2 border-t border-white/10 mt-auto">
          <Link
            href="/demo"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <GridIcon />
            Demo Scenarios
          </Link>
        </div>
      </aside>

      <AddClientModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={handleClientCreated}
      />
    </>
  );
}

export default function AppSidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  return (
    <Suspense>
      <SidebarInner onNavigate={onNavigate} />
    </Suspense>
  );
}

// --- Inline SVG Icons (16x16) ---

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function MessageCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className={`shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
