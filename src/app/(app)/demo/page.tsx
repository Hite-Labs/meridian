import Link from "next/link";
import { DEMO_SCENARIOS } from "@/lib/demo";

export default function DemoPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-xl font-display tracking-tight text-text-dark mb-1">
          Demo Scenarios
        </h1>
        <p className="text-sm text-text-mid">
          Choose a client scenario to explore the practitioner dashboard.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DEMO_SCENARIOS.map((scenario) => {
          return (
            <Link
              key={scenario.id}
              href={`/dashboard?clientId=${scenario.clientId}`}
              className="block p-5 rounded-2xl border border-base-mid bg-base hover:bg-base-mid transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display italic text-text-dark">
                  {scenario.name}
                </span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-light/30 text-primary"
                >
                  {scenario.subtitle}
                </span>
              </div>
              <p className="text-sm text-text-mid">{scenario.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
