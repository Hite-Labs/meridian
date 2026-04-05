import Link from "next/link";
import { DEMO_SCENARIOS } from "@/lib/demo";

const colorMap: Record<string, { bg: string; border: string; badge: string }> = {
  blue: {
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  red: {
    bg: "bg-red-50 hover:bg-red-100",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  amber: {
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  green: {
    bg: "bg-green-50 hover:bg-green-100",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
};

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Demo Scenarios
          </h1>
          <p className="text-gray-500">
            Choose a client scenario to explore the practitioner dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {DEMO_SCENARIOS.map((scenario) => {
            const colors = colorMap[scenario.color] ?? colorMap.blue;
            return (
              <Link
                key={scenario.id}
                href={`/dashboard?clientId=${scenario.clientId}`}
                className={`block p-5 rounded-xl border ${colors.border} ${colors.bg} transition-colors`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">
                    {scenario.name}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}
                  >
                    {scenario.subtitle}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{scenario.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
