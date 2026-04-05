"use client";

interface ClientHeaderProps {
  name: string;
  status: string;
  modality: string;
  sessionCount: number;
  startDate: string;
}

export default function ClientHeader({
  name,
  status,
  modality,
  sessionCount,
  startDate,
}: ClientHeaderProps) {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    graduated: "bg-blue-100 text-blue-700",
    paused: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex flex-wrap items-center gap-4">
      <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] ?? statusColors.active}`}
      >
        {status}
      </span>
      <div className="hidden sm:flex items-center gap-4 ml-auto text-sm text-gray-500">
        <span className="capitalize">{modality}</span>
        <span className="text-gray-300">|</span>
        <span>{sessionCount} sessions</span>
        <span className="text-gray-300">|</span>
        <span>
          Started{" "}
          {new Date(startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
