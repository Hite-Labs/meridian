import Link from "next/link";
import { DEMO_SCENARIOS } from "@/lib/demo";

export default function DemoPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      <div className="rise rise-1 mb-2">
        <div className="eyebrow">Explore</div>
      </div>
      <h1 className="rise rise-2 font-display italic text-text-dark text-4xl sm:text-5xl leading-[0.95] tracking-tight mb-3">
        Demo Scenarios.
      </h1>
      <p className="rise rise-3 text-text-mid font-light max-w-xl mb-8">
        Step into a coach&apos;s chair. Each scenario loads a different client
        with their own story, rhythm, and wellbeing arc.
      </p>

      <div className="rise rise-3 gold-seam mb-8" />

      <div className="grid gap-3 sm:grid-cols-2">
        {DEMO_SCENARIOS.map((scenario, i) => (
          <Link
            key={scenario.id}
            href={`/dashboard?clientId=${scenario.clientId}`}
            className={`rise rise-${4 + (i % 2)} group relative overflow-hidden card-luxe p-5 transition-transform duration-300 hover:-translate-y-0.5`}
          >
            <span className="absolute left-0 top-5 bottom-5 w-[2px] bg-accent/70 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-accent transition" />
            <div className="pl-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="eyebrow">{scenario.subtitle}</span>
              </div>
              <div className="font-display italic text-2xl text-text-dark leading-tight mb-1.5">
                {scenario.name}
              </div>
              <p className="text-sm text-text-mid font-light leading-relaxed">
                {scenario.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
