"use client";

import { useEffect, useState } from "react";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  goal: string | null;
  status: string;
}

interface EditClientModalProps {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onArchived: (clientId: string) => void;
  client: ClientData | null;
}

export default function EditClientModal({
  open,
  onClose,
  onUpdated,
  onArchived,
  client,
}: EditClientModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmArchive, setConfirmArchive] = useState(false);

  useEffect(() => {
    if (client) {
      setFirstName(client.first_name ?? "");
      setLastName(client.last_name ?? "");
      setEmail(client.email ?? "");
      setPhone(client.phone ?? "");
      setNotes(client.notes ?? "");
      setGoal(client.goal ?? "");
      setStatus(client.status ?? "active");
      setError(null);
      setConfirmArchive(false);
    }
  }, [client]);

  if (!open || !client) return null;

  function handleClose() {
    setError(null);
    setConfirmArchive(false);
    setSaving(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const updates: Record<string, string | null> = {};
    if (firstName !== (client!.first_name ?? "")) updates.firstName = firstName;
    if (lastName !== (client!.last_name ?? "")) updates.lastName = lastName;
    if (email !== (client!.email ?? "")) updates.email = email;
    if (phone !== (client!.phone ?? "")) updates.phone = phone || null;
    if (notes !== (client!.notes ?? "")) updates.notes = notes || null;
    if (goal !== (client!.goal ?? "")) updates.goal = goal || null;
    if (status !== (client!.status ?? "active")) updates.status = status;

    if (Object.keys(updates).length === 0) {
      handleClose();
      return;
    }

    try {
      const res = await fetch(`/api/clients/${client!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSaving(false);
        return;
      }

      setSaving(false);
      onUpdated();
      handleClose();
    } catch {
      setError("Failed to update client");
      setSaving(false);
    }
  }

  async function handleArchive() {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${client!.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to archive client");
        setSaving(false);
        return;
      }
      setSaving(false);
      onArchived(client!.id);
      handleClose();
    } catch {
      setError("Failed to archive client");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-primary-deep/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md mx-4 card-luxe p-6 rise max-h-[90vh] overflow-y-auto"
      >
        {confirmArchive ? (
          <>
            <h2 className="font-display italic text-2xl text-text-dark mb-1">
              Archive Client
            </h2>
            <p className="text-sm text-text-mid mb-6">
              This will remove <strong>{firstName} {lastName}</strong> from your
              active client list. Their data will be preserved and can be restored
              later.
            </p>
            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-danger/10 text-danger text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmArchive(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-mid hover:text-text-dark hover:bg-base-mid/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={saving}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-danger text-white hover:bg-danger/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Archiving..." : "Archive"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display italic text-2xl text-text-dark mb-1">
              Edit Client
            </h2>
            <p className="text-sm text-text-mid mb-6">
              Update client details or archive this client.
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
              />
            </label>

            <label className="block mb-3">
              <span className="eyebrow mb-1 block">
                Phone{" "}
                <span className="text-text-soft font-normal normal-case tracking-normal">
                  (optional)
                </span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="+1 (555) 123-4567"
              />
            </label>

            <label className="block mb-3">
              <span className="eyebrow mb-1 block">
                North Star{" "}
                <span className="text-text-soft font-normal normal-case tracking-normal">
                  (coaching goal)
                </span>
              </span>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="What is this client working toward?"
              />
            </label>

            <label className="block mb-3">
              <span className="eyebrow mb-1 block">
                Notes{" "}
                <span className="text-text-soft font-normal normal-case tracking-normal">
                  (optional)
                </span>
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Context, referral source, anything to remember..."
              />
            </label>

            <label className="block mb-6">
              <span className="eyebrow mb-1 block">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-base-mid bg-white text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="paused">Paused</option>
              </select>
            </label>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setConfirmArchive(true)}
                className="text-sm text-danger/70 hover:text-danger transition-colors"
              >
                Archive Client
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-mid hover:text-text-dark hover:bg-base-mid/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-deep transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
