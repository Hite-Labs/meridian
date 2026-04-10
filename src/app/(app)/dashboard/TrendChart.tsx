"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { orsItemLabel } from "@/lib/labels";
import InfoTip from "@/components/InfoTip";

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
  /** WHO-5 normalized to the 0-40 ORS scale for visual overlay. */
  who5Display?: number;
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
  personal: "#6B3FA0",
  relationships: "#C49A28",
  social: "#306D42",
  overall: "#C06060",
} as const;

const subscoreKeys = ["personal", "relationships", "social", "overall"] as const;

const severityColor: Record<string, string> = {
  red: "#B83050",
  amber: "#C49A28",
  green: "#306D42",
  info: "#7A6080",
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
      who5Display: who5 ? who5.score / 2.5 : undefined,
      flags: sessionFlags.map((f) => ({
        severity: f.severity,
        message: f.message,
        rule_key: f.rule_key,
      })),
      isImprovement,
    };
  });

  // Ensure intake appears as "session 0". If the intake ORS point already
  // exists (from orsScores), layer the intake WHO-5 onto it; otherwise insert
  // a WHO-5-only session 0 point.
  const intakeWho5 = who5Scores.find(
    (w) => w.questionnaire_type === "intake"
  );
  if (intakeWho5) {
    const existingIntake = compositeData.find((p) => p.sessionNumber === 0);
    if (existingIntake) {
      existingIntake.who5 = intakeWho5.score;
      existingIntake.who5Display = intakeWho5.score / 2.5;
    } else {
      compositeData.unshift({
        sessionNumber: 0,
        sessionDate: "",
        ors: 0,
        who5: intakeWho5.score,
        who5Display: intakeWho5.score / 2.5,
        flags: [],
        isImprovement: false,
      });
    }
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

  return (
    <div className="card-luxe p-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-display tracking-tight text-text-dark">
            Progress Trend
          </h2>
          <InfoTip label="About this chart" align="left">
            <p className="mb-2">
              <span className="font-medium text-text-dark">Session Wellbeing</span> is the
              client&apos;s own rating across four parts of life — inner life, close
              relationships, daily world, and overall — scored out of 40.
            </p>
            <p className="mb-2">
              <span className="font-medium text-text-dark">Monthly Wellbeing</span> (the dashed
              line) is a broader self-report of energy and mood, taken less often.
            </p>
            <p className="text-text-soft">
              These are conversation starters for coaching, not clinical measures. The numbers
              help you notice shifts and ask better questions — they don&apos;t diagnose
              anything.
            </p>
          </InfoTip>
        </div>
        <div className="flex bg-base-mid rounded-lg p-0.5">
          <button
            onClick={() => setView("composite")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              view === "composite"
                ? "bg-base text-text-dark shadow-sm"
                : "text-text-soft hover:text-text-mid"
            }`}
          >
            Composite
          </button>
          <button
            onClick={() => setView("breakdown")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              view === "breakdown"
                ? "bg-base text-text-dark shadow-sm"
                : "text-text-soft hover:text-text-mid"
            }`}
          >
            Breakdown
          </button>
        </div>
      </div>

      {view === "composite" ? (
        <CompositeChart data={compositeData} />
      ) : (
        <BreakdownChart data={breakdownData} />
      )}

      {/* Legend */}
      {view === "composite" ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-text-soft">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: "#6B3FA0" }} />
            Session Wellbeing
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 inline-block"
              style={{
                borderTop: "2px dashed #C49A28",
                height: 0,
              }}
            />
            Monthly Wellbeing
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-text-soft">
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
function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CompositeChart({
  data,
}: {
  data: CompositeDataPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 36 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E0EC" />
        <XAxis
          dataKey="sessionNumber"
          tick={({ x, y, payload }) => {
            const d = data.find((p) => p.sessionNumber === payload.value);
            const label = payload.value === 0 ? "Intake" : `S${payload.value}`;
            const date = d?.sessionDate ? formatDateShort(d.sessionDate) : "";
            return (
              <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={14} textAnchor="middle" fill="#7A6080" fontSize={12}>{label}</text>
                {date && <text x={0} y={0} dy={28} textAnchor="middle" fill="#AE9AB8" fontSize={10}>{date}</text>}
              </g>
            );
          }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#AE9AB8" }}
          domain={[0, 40]}
          ticks={[0, 10, 20, 30, 40]}
          allowDataOverflow
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const d = payload[0]?.payload as CompositeDataPoint;
            return (
              <div className="bg-base border border-base-mid rounded-lg shadow-lg p-3 text-sm">
                <div className="font-medium font-display text-text-dark">
                  {d.sessionNumber === 0
                    ? "Intake"
                    : `Session ${d.sessionNumber}`}
                </div>
                {d.sessionDate && (
                  <div className="text-text-soft text-xs mb-1">
                    {new Date(d.sessionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
                {d.ors > 0 && (
                  <div className="text-text-mid">
                    Session Wellbeing: {d.ors}
                  </div>
                )}
                {d.who5 !== undefined && (
                  <div className="text-text-mid">
                    Monthly Wellbeing: {d.who5}
                  </div>
                )}
                <TooltipFlags flags={d.flags} />
                {d.isImprovement && (
                  <div className="text-success text-xs mt-1 font-medium">
                    Meaningful improvement
                  </div>
                )}
              </div>
            );
          }}
        />

        <Line
          type="monotone"
          dataKey="who5Display"
          stroke="#C49A28"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
          connectNulls={false}
          name="Monthly Wellbeing"
        />

        <Line
          type="monotone"
          dataKey="ors"
          stroke="#6B3FA0"
          strokeWidth={2.5}
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (!cx || !cy || !payload) return <circle key="empty" />;
            const d = payload as CompositeDataPoint;
            // Hide the ORS dot only when there's no ORS value (e.g. intake WHO-5-only point).
            if (d.ors === 0)
              return <circle key={`dot-${d.sessionNumber}-empty`} />;
            if (d.isImprovement) {
              return (
                <g key={`dot-${d.sessionNumber}`}>
                  <circle cx={cx} cy={cy} r={6} fill="#6B3FA0" />
                  <circle cx={cx} cy={cy} r={3} fill="var(--color-base)" />
                </g>
              );
            }
            return (
              <circle
                key={`dot-${d.sessionNumber}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="#6B3FA0"
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
        margin={{ top: 10, right: 10, left: -10, bottom: 36 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E0EC" />
        <XAxis
          dataKey="sessionNumber"
          tick={({ x, y, payload }) => {
            const d = data.find((p) => p.sessionNumber === payload.value);
            const date = d?.sessionDate ? formatDateShort(d.sessionDate) : "";
            const label = payload.value === 0 ? "Intake" : `S${payload.value}`;
            return (
              <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={14} textAnchor="middle" fill="#7A6080" fontSize={12}>{label}</text>
                {date && <text x={0} y={0} dy={28} textAnchor="middle" fill="#AE9AB8" fontSize={10}>{date}</text>}
              </g>
            );
          }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#AE9AB8" }}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const d = payload[0]?.payload as BreakdownDataPoint;
            return (
              <div className="bg-base border border-base-mid rounded-lg shadow-lg p-3 text-sm">
                <div className="font-medium font-display text-text-dark mb-1">
                  {d.sessionNumber === 0 ? "Intake" : `Session ${d.sessionNumber}`}
                </div>
                {d.sessionDate && (
                  <div className="text-text-soft text-xs mb-2">
                    {new Date(d.sessionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
                {subscoreKeys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-text-mid"
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: subscoreColors[key] }}
                    />
                    <span className="flex-1">{orsItemLabel[key]}</span>
                    <span className="font-medium tabular-nums">{d[key]}</span>
                  </div>
                ))}
                <div className="text-text-soft text-xs mt-1.5 pt-1.5 border-t border-base-mid">
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
    <div className="mt-1 pt-1 border-t border-base-mid">
      {flags.map((f) => (
        <div
          key={f.rule_key}
          className="flex items-center gap-1 text-xs mt-0.5"
        >
          <span
            className="w-2 h-2 rounded-full inline-block shrink-0"
            style={{
              backgroundColor: severityColor[f.severity] ?? "#AE9AB8",
            }}
          />
          {f.message}
        </div>
      ))}
    </div>
  );
}
