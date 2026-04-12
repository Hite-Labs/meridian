"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ClientSummary {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  status: string;
  latestOrs: number | null;
  lastSessionDate: string | null;
  activeFlagCount: number;
}

interface ClientListProps {
  onAddClient: () => void;
}

export default function ClientList({ onAddClient }: ClientListProps) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-text-soft">Loading clients...</div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center max-w-sm rise rise-1">
          <div className="w-14 h-14 rounded-full bg-accent-light/60 border border-accent/30 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_-12px_rgba(196,154,40,0.6)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B5B12" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 className="font-display italic text-2xl text-text-dark mb-2">No clients yet</h2>
          <p className="text-text-mid text-sm mb-6">Add your first client to get started.</p>
          <button
            onClick={onAddClient}
            className="px-6 py-3 rounded-xl font-medium text-sm bg-primary-deep text-accent-light hover:bg-primary transition-colors shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)]"
          >
            Add Client
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">Dashboard</div>
          <h1 className="font-display italic text-3xl sm:text-4xl text-text-dark">Your Clients</h1>
        </div>
        <button
          onClick={onAddClient}
          className="px-5 py-2.5 rounded-xl font-medium text-sm bg-primary-deep text-accent-light hover:bg-primary transition-colors shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)]"
        >
          Add Client
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const statusColors: Record<string, string> = {
            active: "bg-success/10 text-success",
            graduated: "bg-primary-light text-primary",
            paused: "bg-base-mid text-text-mid",
          };

          return (
            <button
              key={client.id}
              onClick={() => router.push(`/dashboard?clientId=${client.id}`)}
              className="card-luxe p-5 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary-light/40 flex items-center justify-center text-sm font-medium shrink-0">
                    {client.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display italic text-lg text-text-dark truncate group-hover:text-primary transition-colors">
                      {client.name}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColors[client.status] ?? "bg-base-mid text-text-mid"}`}>
                      {client.status}
                    </span>
                  </div>
                </div>
                {client.activeFlagCount > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-danger text-[11px] text-white font-bold shrink-0">
                    {client.activeFlagCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-text-soft">
                {client.latestOrs !== null && (
                  <div>
                    <span className="eyebrow block mb-0.5">ORS</span>
                    <span className="text-sm font-medium text-text-dark">{client.latestOrs}</span>
                    <span className="text-text-soft">/40</span>
                  </div>
                )}
                {client.lastSessionDate && (
                  <div>
                    <span className="eyebrow block mb-0.5">Last Session</span>
                    <span className="text-sm text-text-mid">
                      {new Date(client.lastSessionDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {!client.latestOrs && !client.lastSessionDate && (
                  <span className="text-text-soft italic">Awaiting intake</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
