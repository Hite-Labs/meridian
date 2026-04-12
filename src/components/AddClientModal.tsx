"use client";

import { useState } from "react";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (client: { id: string; name: string }) => void;
}

export default function AddClientModal({ open, onClose, onCreated }: AddClientModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setError(null);
    setSaving(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSaving(false);
        return;
      }

      reset();
      onCreated({ id: data.client.id, name: data.client.name });
    } catch {
      setError("Failed to create client");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary-deep/40 backdrop-blur-sm"
        onClick={() => { reset(); onClose(); }}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md mx-4 card-luxe p-6 rise"
      >
        <h2 className="font-display italic text-2xl text-text-dark mb-1">
          Add New Client
        </h2>
        <p className="text-sm text-text-mid mb-6">
          Create a client record. You can send their intake invitation separately.
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-danger/10 text-danger text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="block">
            <span className="eyebrow mb-1 block">First Name</span>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="e.g. Sarah"
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-1 block">Last Name</span>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="e.g. Johnson"
            />
          </label>
        </div>

        <label className="block mb-3">
          <span className="eyebrow mb-1 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="sarah@example.com"
          />
        </label>

        <label className="block mb-3">
          <span className="eyebrow mb-1 block">Phone <span className="text-text-soft font-normal normal-case tracking-normal">(optional, for SMS check-ins)</span></span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="+1 (555) 123-4567"
          />
        </label>

        <label className="block mb-6">
          <span className="eyebrow mb-1 block">Notes <span className="text-text-soft font-normal normal-case tracking-normal">(optional)</span></span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            placeholder="Initial goals, context, referral source..."
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => { reset(); onClose(); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-mid hover:text-text-dark hover:bg-base-mid/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-deep transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Client"}
          </button>
        </div>
      </form>
    </div>
  );
}
