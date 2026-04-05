"use client";

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

interface OrsDataPoint {
  sessionNumber: number;
  sessionDate: string;
  score: number;
  sessionId: string | null;
}

interface TrendChartProps {
  orsScores: OrsDataPoint[];
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

interface ChartDataPoint {
  sessionNumber: number;
  sessionDate: string;
  ors: number;
  who5?: number;
  flags: Array<{ severity: string; message: string; rule_key: string }>;
  isImprovement: boolean;
}

export default function TrendChart({
  orsScores,
  who5Scores,
  flags,
  sessions,
}: TrendChartProps) {
  const chartData: ChartDataPoint[] = orsScores.map((ors) => {
    const sessionFlags = flags.filter(
      (f) => f.session_id === ors.sessionId
    );
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
    chartData.unshift({
      sessionNumber: 0,
      sessionDate: "",
      ors: 0,
      who5: intakeWho5.score,
      flags: [],
      isImprovement: false,
    });
  }

  const severityColor: Record<string, string> = {
    red: "#ef4444",
    amber: "#f59e0b",
    green: "#22c55e",
    info: "#3b82f6",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Progress Trend
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
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
              const data = payload[0]?.payload as ChartDataPoint;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
                  <div className="font-medium text-gray-900">
                    {data.sessionNumber === 0
                      ? "Intake"
                      : `Session ${data.sessionNumber}`}
                  </div>
                  {data.sessionDate && (
                    <div className="text-gray-500 text-xs mb-1">
                      {new Date(data.sessionDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {data.ors > 0 && (
                    <div className="text-gray-700">Session Wellbeing: {data.ors}</div>
                  )}
                  {data.who5 !== undefined && (
                    <div className="text-gray-700">Monthly Wellbeing: {data.who5}</div>
                  )}
                  {data.flags.length > 0 && (
                    <div className="mt-1 pt-1 border-t border-gray-100">
                      {data.flags.map((f) => (
                        <div
                          key={f.rule_key}
                          className="flex items-center gap-1 text-xs mt-0.5"
                        >
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{
                              backgroundColor:
                                severityColor[f.severity] ?? "#9ca3af",
                            }}
                          />
                          {f.message}
                        </div>
                      ))}
                    </div>
                  )}
                  {data.isImprovement && (
                    <div className="text-green-600 text-xs mt-1 font-medium">
                      Meaningful improvement
                    </div>
                  )}
                </div>
              );
            }}
          />

          {/* Distress threshold */}
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

          {/* Plateau band: sessions 1–3 */}
          <ReferenceArea
            x1={1}
            x2={3}
            fill="#fef3c7"
            fillOpacity={0.3}
          />

          {/* WHO-5 line (secondary) */}
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

          {/* ORS line (primary) */}
          <Line
            type="monotone"
            dataKey="ors"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (!cx || !cy || !payload) return <circle key="empty" />;
              const d = payload as ChartDataPoint;
              if (d.sessionNumber === 0) return <circle key="intake-hidden" />;
              if (d.isImprovement) {
                // Star marker for reliable improvement
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

      {/* Flag indicators below chart */}
      <div className="flex gap-1 mt-2 ml-8">
        {chartData
          .filter((d) => d.sessionNumber > 0)
          .map((d) => (
            <div
              key={d.sessionNumber}
              className="flex-1 flex justify-center gap-0.5"
            >
              {d.flags.map((f) => (
                <span
                  key={f.rule_key}
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    backgroundColor:
                      severityColor[f.severity] ?? "#9ca3af",
                  }}
                  title={f.message}
                />
              ))}
            </div>
          ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-blue-600 inline-block" />
          Session Wellbeing
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-blue-300 inline-block border-dashed" style={{ borderTop: "2px dashed #93c5fd", height: 0 }} />
          Monthly Wellbeing
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-amber-100 rounded inline-block border border-amber-200" />
          Plateau period
        </div>
      </div>
    </div>
  );
}
