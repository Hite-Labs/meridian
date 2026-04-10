"use client";

interface ClientHeaderProps {
  name: string;
  status: string;
  modality: string;
  goal: string | null;
  sessionCount: number;
  startDate: string;
}

export default function ClientHeader({
  name,
  status,
  goal,
  sessionCount,
  startDate,
}: ClientHeaderProps) {
  const statusColors: Record<string, string> = {
    graduated: "bg-primary-light text-primary",
    paused: "bg-base-mid text-text-mid",
  };

  return (
    <header className="flex flex-wrap items-end gap-x-6 gap-y-3">
      <div className="flex-1 min-w-0">
        <div className="eyebrow mb-2">Client Snapshot</div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display italic tracking-tight text-text-dark text-3xl sm:text-4xl lg:text-5xl leading-[0.95]">
            {name}
          </h1>
          {status !== "active" && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusColors[status] ?? "bg-base-mid text-text-mid"}`}
            >
              {status}
            </span>
          )}
        </div>
        {goal && (
          <p className="mt-3 max-w-2xl font-display text-text-mid text-base sm:text-lg leading-snug">
            <span className="eyebrow mr-2 align-middle">North Star</span>
            {goal}
          </p>
        )}
      </div>
      <div className="hidden sm:flex flex-col items-end text-right gap-1 pt-1">
        <span className="font-display italic text-2xl text-text-dark leading-none">
          {sessionCount}
          <span className="text-sm text-text-soft font-sans not-italic ml-1.5 font-light">
            sessions
          </span>
        </span>
        {startDate && (
          <span className="eyebrow !tracking-[0.14em]">
            Since{" "}
            {new Date(startDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </header>
  );
}
