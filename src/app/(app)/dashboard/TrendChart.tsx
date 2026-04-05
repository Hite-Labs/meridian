"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { orsItemLabel } from "@/lib/labels";

interface OrsDataPoint {
  sessionNumber: number;
  sessionDate: string;
  score: number;
  sessionId: string | null;
}

interface OrsSubscorePoint {
  sessionNumber: number;
  sessionDate: string;
  personal: number;
  relationships: number;
  social: number;
  overall: number;
}

interface TrendChartProps {
  orsScores: OrsDataPoint[];
  orsSubscores: OrsSubscorePoint[];
  who5Scores: Array<{
    sessionId: string | null;
    questionnaire_type: string;
    score: number;
  }>;
  flags: Array<{
    session_id: string | null;
    severity: string;
    rule_key: string;
    message: string;
  }>;
  sessions: Array<{
    id: string;
    session_number: number;
    session_date: string;
  }>;
}

interface CompositeDataPoint {
  sessionNumber: number;
  sessionDate: string;
  ors: number;
  who5?: number;
  flags: Array<{ severity: string; message: string; rule_key: string }>;
  isImprovement: boolean;
}

interface BreakdownDataPoint {
  sessionNumber: number;
  sessionDate: string;
  personal: number;
  relationships: number;
  social: number;
  overall: number;
  flags: Array<{ severity: string; message: string; rule_key: string }>;
}

type ViewMode = "composite" | "breakdown";

const subscoreColors = {
  personal: "#6366f1",
  relationships: "#f59e0b",
  social: "#10b981",
  overall: "#8b5cf6",
} as const;

const subscoreKeys = ["personal", "relationships", "social", "overall"] as const;

const severityColor: Record<string, string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  info: "#3b82f6",
};

export default function TrendChart({
  orsScores,
  orsSubscores,
  who5Scores,
  flags,
  sessions,
}: TrendChartProps) {
  const [view, setView] = useState<ViewMode>("composite");

  // --- Composite data ---
  const compositeData: CompositeDataPoint[] = orsScores.map((ors) => {
    const sessionFlags = flags.filter((f) => f.session_id === ors.sessionId);
    const who5 = who5Scores.find((w) => w.sessionId === ors.sessionId);
    const isImprovement = sessionFlags.some(
      (f) => f.rule_key === "ors_improvement"
    );
    return {
      sessionNumber: ors.sessionNumber,
      sessionDate: ors.sessionDate,
      ors: ors.score,
      who5: who5 ? who5.score : undefined,
      flags: sessionFlags.map((f) => ({
        severity: f.severity,
        message: f.message,
        rule_key: f.rule_key,
      })),
      isImprovement,
    };
  });

  // Add intake WHO-5 as "session 0"
  const intakeWho5 = who5Scores.find(
    (w) => w.questionnaire_type === "intake"
  );
  if (intakeWho5) {
    compositeData.unshift({
      sessionNumber: 0,
      sessionDate: "",
      ors: 0,
      who5: intakeWho5.score,
      flags: [],
      isImprovement: false,
    });
  }

  // --- Breakdown data ---
  const breakdownData: BreakdownDataPoint[] = orsSubscores.map((sub) => {
    const session = sessions.find(
      (s) => s.session_number === sub.sessionNumber
    );
    const sessionFlags = flags.filter(
      (f) => f.session_id === session?.id
    );
    return {
      ...sub,
      flags: sessionFlags.map((f) => ({
        severity: f.severity,
        message: f.message,
        rule_key: f.rule_key,
      })),
    };
  });

  // Detect plateau band (consecutive sessions 1-3 that are all in distress)
  const plateauSessions = compositeData.filter(
    (d) =>
      d.sessionNumber >= 1 &&
      d.sessionNumber <= 3 &&
      d.ors > 0 &&
      d.ors < 25
  );
  const showPlateau = plateauSessions.length >= 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold tracking-tight text-gray-900">
          Progress Trend
        </h2>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setView("composite")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              view === "composite"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Composite
          </button>
          <button
            onClick={() => setView("breakdown")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              view === "breakdown"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Breakdown
          </button>
        </div>
      </div>

      {view === "composite" ? (
        <CompositeChart
          data={compositeData}
          showPlateau={showPlateau}
        />
      ) : (
        <BreakdownChart data={breakdownData} />
      )}

      {/* Flag indicators below chart */}
      {view === "composite" ? (
        <FlagDots data={compositeData} />
      ) : (
        <FlagDots data={breakdownData} />
      )}

      {/* Legend */}
      {view === "composite" ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-blue-600 inline-block" />
            Session Wellbeing
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 inline-block"
              style={{
                borderTop: "2px dashed #93c5fd",
                height: 0,
              }}
            />
            Monthly Wellbeing
          </div>
          {showPlateau && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-100 rounded inline-block border border-amber-200" />
              Plateau period
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-gray-500">
          {subscoreKeys.map((key) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="w-4 h-0.5 inline-block rounded-full"
                style={{ backgroundColor: subscoreColors[key] }}
              />
              {orsItemLabel[key]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Composite chart view ---
function CompositeChart({
  data,
  showPlateau,
}: {
  data: CompositeDataPoint[];
  showPlateau: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="sessionNumber"
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickFormatter={(v) => (v === 0 ? "Intake" : `S${v}`)}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          domain={[0, 40]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const d = payload[0]?.payload as CompositeDataPoint;
            return (
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
                <div className="font-medium text-gray-900">
                  {d.sessionNumber === 0
                    ? "Intake"
                    : `Session ${d.sessionNumber}`}
                </div>
                {d.sessionDate && (
                  <div className="text-gray-500 text-xs mb-1">
                    {new Date(d.sessionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
                {d.ors > 0 && (
                  <div className="text-gray-700">
                    Session Wellbeing: {d.ors}
                  </div>
                )}
                {d.who5 !== undefined && (
                  <div className="text-gray-700">
                    Monthly Wellbeing: {d.who5}
                  </div>
                )}
                <TooltipFlags flags={d.flags} />
                {d.isImprovement && (
                  <div className="text-green-600 text-xs mt-1 font-medium">
                    Meaningful improvement
                  </div>
                )}
              </div>
            );
          }}
        />

        <ReferenceLine
          y={25}
          stroke="#d1d5db"
          strokeDasharray="6 3"
          label={{
            value: "Wellbeing threshold",
            position: "insideTopRight",
            fill: "#9ca3af",
            fontSize: 11,
          }}
        />

        {showPlateau && (
          <ReferenceArea x1={1} x2={3} fill="#fef3c7" fillOpacity={0.3} />
        )}

        <Line
          type="monotone"
          dataKey="who5"
          stroke="#93c5fd"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={{ r: 4, fill: "#93c5fd" }}
          connectNulls={false}
          name="Monthly Wellbeing"
        />

        <Line
          type="monotone"
          dataKey="ors"
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (!cx || !cy || !payload) return <circle key="empty" />;
            const d = payload as CompositeDataPoint;
            if (d.sessionNumber === 0)
              return <circle key="intake-hidden" />;
            if (d.isImprovement) {
              return (
                <g key={`dot-${d.sessionNumber}`}>
                  <circle cx={cx} cy={cy} r={6} fill="#2563eb" />
                  <circle cx={cx} cy={cy} r={3} fill="white" />
                </g>
              );
            }
            return (
              <circle
                key={`dot-${d.sessionNumber}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="#2563eb"
              />
            );
          }}
          activeDot={{ r: 6 }}
          name="Session Wellbeing"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// --- Breakdown chart view ---
function BreakdownChart({ data }: { data: BreakdownDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="sessionNumber"
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickFormatter={(v) => `S${v}`}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const d = payload[0]?.payload as BreakdownDataPoint;
            return (
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  Session {d.sessionNumber}
                </div>
                {d.sessionDate && (
                  <div className="text-gray-500 text-xs mb-2">
                    {new Date(d.sessionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
                {subscoreKeys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: subscoreColors[key] }}
                    />
                    <span className="flex-1">{orsItemLabel[key]}</span>
                    <span className="font-medium tabular-nums">{d[key]}</span>
                  </div>
                ))}
                <div className="text-gray-500 text-xs mt-1.5 pt-1.5 border-t border-gray-100">
                  Total: {d.personal + d.relationships + d.social + d.overall}
                </div>
                <TooltipFlags flags={d.flags} />
              </div>
            );
          }}
        />

        {subscoreKeys.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={subscoreColors[key]}
            strokeWidth={2}
            dot={{ r: 3, fill: subscoreColors[key] }}
            activeDot={{ r: 5 }}
            name={orsItemLabel[key]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// --- Shared components ---
function TooltipFlags({
  flags,
}: {
  flags: Array<{ severity: string; message: string; rule_key: string }>;
}) {
  if (flags.length === 0) return null;
  return (
    <div className="mt-1 pt-1 border-t border-gray-100">
      {flags.map((f) => (
        <div
          key={f.rule_key}
          className="flex items-center gap-1 text-xs mt-0.5"
        >
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0"
            style={{
              backgroundColor: severityColor[f.severity] ?? "#9ca3af",
            }}
          />
          {f.message}
        </div>
      ))}
    </div>
  );
}

function FlagDots({
  data,
}: {
  data: Array<{
    sessionNumber: number;
    flags: Array<{ severity: string; message: string; rule_key: string }>;
  }>;
}) {
  const sessions = data.filter((d) => d.sessionNumber > 0);
  if (sessions.length === 0) return null;
  return (
    <div className="flex gap-1 mt-2 ml-8">
      {sessions.map((d) => (
        <div
          key={d.sessionNumber}
          className="flex-1 flex justify-center gap-0.5"
        >
          {d.flags.map((f) => (
            <span
              key={f.rule_key}
              className="w-2 h-2 rounded-full inline-block"
              style={{
                backgroundColor: severityColor[f.severity] ?? "#9ca3af",
              }}
              title={f.message}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
