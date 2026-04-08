import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-base">
      <div className="max-w-sm w-full text-center">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
          <h1 className="text-2xl font-display italic tracking-tight text-text-dark">
            Meridian
          </h1>
        </div>
        <p className="text-text-mid text-sm mb-10">Coaching Progress Tracker</p>

        <div className="space-y-2.5">
          <Link
            href="/intake"
            className="block w-full py-3.5 rounded-xl bg-accent text-text-dark font-medium hover:bg-accent-deep transition-colors"
          >
            Client Intake
          </Link>
          <Link
            href="/check-in"
            className="block w-full py-3.5 rounded-xl bg-base text-text-dark font-medium hover:bg-base-mid transition-colors border border-base-mid"
          >
            End-of-Session Check-In
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-3.5 rounded-xl bg-base text-text-dark font-medium hover:bg-base-mid transition-colors border border-base-mid"
          >
            Practitioner Dashboard
          </Link>
          <Link
            href="/demo"
            className="block w-full py-3.5 rounded-xl bg-primary-deep text-white font-medium hover:bg-primary transition-colors"
          >
            Demo Scenarios
          </Link>
        </div>

        <p className="text-xs font-light text-text-soft mt-8">
          Demo mode — no authentication required
        </p>
      </div>
    </div>
  );
}
