"use client";

import { orsItemLabel } from "@/lib/labels";
import InfoTip from "@/components/InfoTip";

const subscoreDescriptions: Record<string, string> = {
  personal:
    "Inner sense of wellbeing, energy, and life satisfaction",
  relationships:
    "Close relationships and interpersonal connections",
  social:
    "Work, school, and broader social world",
  overall:
    "General sense of how life is going across all areas",
};

const subscoreKeys = ["personal", "relationships", "social", "overall"] as const;

type TrendDirection = "up" | "down" | "stable";

function computeTrend(current: number, previous: number | null, threshold: number): TrendDirection {
  if (previous === null) return "stable";
  const diff = current - previous;
  if (diff >= threshold) return "up";
  if (diff <= -threshold) return "down";
  return "stable";
}

function TrendArrow({ direction }: { direction: TrendDirection }) {
  if (direction === "up") {
    return <span className="text-success text-sm font-medium" title="Trending up">&uarr;</span>;
  }
  if (direction === "down") {
    return <span className="text-danger text-sm font-medium" title="Trending down">&darr;</span>;
  }
  return <span className="text-text-soft text-sm" title="Stable">&rarr;</span>;
}

interface BreakdownPanelProps {
  latestSubscores: {
    personal: number;
    relationships: number;
    social: number;
    overall: number;
    sessionNumber: number;
    sessionDate: string;
  } | null;
  previousSubscores: {
    personal: number;
    relationships: number;
    social: number;
    overall: number;
  } | null;
  latestComposite: { score: number; sessionNumber: number } | null;
  previousComposite: { score: number } | null;
  latestNotes: string | null;
  latestNextSteps: string | null;
  bodyMetrics: {
    bodySafety: number | null;
    suds: number | null;
    voc: number | null;
  } | null;
  intakeData: {
    who5: number | null;
    anxiety: number | null;
    depression: number | null;
  } | null;
}

export default function BreakdownPanel({
  latestSubscores,
  previousSubscores,
  latestComposite,
  previousComposite,
  latestNotes,
  latestNextSteps,
  bodyMetrics,
  intakeData,
}: BreakdownPanelProps) {
  // State 1: No data at all — awaiting intake
  if (!latestSubscores && !latestComposite && !intakeData) {
    return (
      <div className="card-luxe p-6">
        <div className="text-center py-8">
          <div className="text-text-soft mb-3">
            <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-mid">Awaiting Intake</p>
          <p className="text-xs font-light text-text-soft mt-1">Client data will appear here once they complete their intake questionnaire.</p>
        </div>
      </div>
    );
  }

  // State 2: Intake data only — no sessions yet
  if (!latestSubscores && !latestComposite && intakeData) {
    return (
      <div className="card-luxe">
        <div className="px-6 py-4 border-b border-base-mid">
          <h2 className="font-display text-base tracking-tight text-text-dark">
            Intake Summary
          </h2>
          <p className="text-xs font-light text-text-soft mt-1">
            Baseline scores from the client&apos;s intake questionnaire
          </p>
        </div>

        <div className="px-6 py-4 space-y-3">
          {intakeData.who5 !== null && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-text-mid font-medium">Monthly Wellbeing</span>
                <p className="text-xs font-light text-text-soft">Overall energy, mood, and daily satisfaction</p>
              </div>
              <span className="font-display italic text-lg tabular-nums text-text-dark">
                {intakeData.who5}/100
              </span>
            </div>
          )}

          {intakeData.anxiety !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-mid font-medium">Stress & Worry</span>
              <span className="font-display italic text-sm tabular-nums text-text-dark">
                {intakeData.anxiety}/6
              </span>
            </div>
          )}

          {intakeData.depression !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-mid font-medium">Mood & Energy</span>
              <span className="font-display italic text-sm tabular-nums text-text-dark">
                {intakeData.depression}/6
              </span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-base-mid">
          <p className="text-xs font-light text-text-soft text-center">
            Session wellbeing scores will appear here after the first session.
          </p>
        </div>
      </div>
    );
  }

  // State 3: Has session data — full breakdown
  if (!latestSubscores || !latestComposite) return null;

  const compositeTotal =
    latestSubscores.personal +
    latestSubscores.relationships +
    latestSubscores.social +
    latestSubscores.overall;
  const compositeTrend = computeTrend(
    compositeTotal,
    previousComposite?.score ?? null,
    3
  );

  return (
    <div className="card-luxe">
      <div className="px-6 py-4 border-b border-base-mid">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base tracking-tight text-text-dark">
            Most Recent Session
          </h2>
          <span className="text-xs font-light text-text-soft">
            Session {latestSubscores.sessionNumber}
            {latestSubscores.sessionDate && (
              <>
                {" \u00b7 "}
                {new Date(latestSubscores.sessionDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </>
            )}
          </span>
        </div>
        <p className="text-xs font-light text-text-soft mt-1">
          Scores from the client&apos;s last session, with trend vs. the session before
        </p>
      </div>

      {/* Composite ORS */}
      <div className="px-6 py-3 border-b border-base-mid">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-text-mid font-medium">Overall Wellbeing</span>
            <InfoTip label="About this score" align="left">
              <p className="mb-2">
                The client&apos;s own rating of four parts of life — inner life, close
                relationships, daily world, and overall — added up to a score out of 40.
              </p>
              <p className="text-text-soft">
                It&apos;s a coaching conversation starter, not a clinical measure. Changes over
                time matter more than any single number.
              </p>
            </InfoTip>
          </div>
          <div className="flex items-center gap-2">
            <TrendArrow direction={compositeTrend} />
            <span className="font-display italic text-lg tabular-nums text-text-dark">
              {compositeTotal}/40
            </span>
          </div>
        </div>
      </div>

      {/* Subscore breakdown */}
      <div className="px-6 py-4 space-y-4">
        {subscoreKeys.map((key) => {
          const current = latestSubscores[key];
          const previous = previousSubscores ? previousSubscores[key] : null;
          const trend = computeTrend(current, previous, 1);
          return (
            <div key={key}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-mid font-medium">
                  {orsItemLabel[key]}
                </span>
                <div className="flex items-center gap-2">
                  <TrendArrow direction={trend} />
                  <span className="font-display italic text-sm tabular-nums text-text-dark">
                    {current}/10
                  </span>
                </div>
              </div>
              <p className="text-xs font-light text-text-soft mt-0.5">
                {subscoreDescriptions[key]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Body & Somatic metrics */}
      {bodyMetrics && (bodyMetrics.bodySafety !== null || bodyMetrics.suds !== null || bodyMetrics.voc !== null) && (
        <div className="px-6 py-4 border-t border-base-mid">
          <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-2">
            Body & Somatic
          </div>
          <div className="flex gap-4 text-sm">
            {bodyMetrics.bodySafety !== null && (
              <span className="font-light text-text-soft">
                Body Safety:{" "}
                <span className="font-medium text-text-dark">{bodyMetrics.bodySafety}</span>
              </span>
            )}
            {bodyMetrics.suds !== null && (
              <span className="font-light text-text-soft">
                Emotional Charge:{" "}
                <span className="font-medium text-text-dark">{bodyMetrics.suds}</span>
              </span>
            )}
            {bodyMetrics.voc !== null && (
              <span className="font-light text-text-soft">
                Body Belief:{" "}
                <span className="font-medium text-text-dark">{bodyMetrics.voc}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Session highlights */}
      {latestNotes ? (
        <div className="px-6 py-4 border-t border-base-mid">
          <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">
            Session Highlights
          </div>
          <p className="text-sm text-text-mid">{latestNotes}</p>
        </div>
      ) : (
        <div className="px-6 py-4 border-t border-base-mid">
          <div className="border-2 border-dashed border-base-mid rounded-xl p-6 text-center">
            <svg className="w-8 h-8 mx-auto text-text-soft mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-text-soft">Add Session Notes</p>
            <p className="text-xs text-text-soft mt-1">Drop notes here or click to upload</p>
          </div>
        </div>
      )}

      {/* Next steps */}
      {latestNextSteps && (
        <div className="px-6 py-4 border-t border-base-mid">
          <div className="text-xs font-light text-text-soft uppercase tracking-wide mb-2">
            Next Steps
          </div>
          <ul className="space-y-1.5">
            {latestNextSteps.split("\n").filter(Boolean).map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-mid">
                <span className="mt-0.5 w-4 h-4 rounded border border-base-mid shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
