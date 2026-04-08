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
    <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display italic text-xl tracking-tight text-text-dark">{name}</h1>
          {status !== "active" && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] ?? "bg-base-mid text-text-mid"}`}
            >
              {status}
            </span>
          )}
        </div>
        {goal && (
          <p className="text-sm text-text-mid mt-0.5">{goal}</p>
        )}
      </div>
      <div className="hidden sm:flex items-center gap-4 ml-auto text-sm font-light text-text-soft pt-1">
        <span>{sessionCount} sessions</span>
        {startDate && (
          <>
            <span className="text-text-soft">|</span>
            <span>
              Started{" "}
              {new Date(startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
