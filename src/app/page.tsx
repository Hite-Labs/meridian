import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-slate-50">
      <div className="max-w-sm w-full text-center">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Meridian
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-10">Coaching Progress Tracker</p>

        <div className="space-y-2.5">
          <Link
            href="/intake"
            className="block w-full py-3.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Client Intake
          </Link>
          <Link
            href="/check-in"
            className="block w-full py-3.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            End-of-Session Check-In
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-3.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            Practitioner Dashboard
          </Link>
          <Link
            href="/demo"
            className="block w-full py-3.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            Demo Scenarios
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Demo mode — no authentication required
        </p>
      </div>
    </div>
  );
}
