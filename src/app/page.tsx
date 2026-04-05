import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Meridian</h1>
        <p className="text-gray-500 mb-10">Coaching Progress Tracker</p>

        <div className="space-y-3">
          <Link
            href="/intake"
            className="block w-full py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Client Intake
          </Link>
          <Link
            href="/check-in"
            className="block w-full py-4 rounded-xl bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
          >
            End-of-Session Check-In
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Practitioner Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Demo mode — no authentication required
        </p>
      </div>
    </div>
  );
}
