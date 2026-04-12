# Flag Rules

Flags are practitioner-only alerts. They surface on the practitioner dashboard, never on client-facing views. Tone is coaching-oriented, not clinical.

## Flag Properties

| Field | Description |
|-------|-------------|
| flag_type | threshold, cross_instrument, or trend |
| severity | green (positive), amber (concern), red (significant), info (informational) |
| rule_key | Machine identifier for the rule |
| message | Practitioner-facing narrative |
| suggested_language | Optional coaching language for client conversations |

## Visual Display Rules

- Red/amber flags shown prominently as "Concerns" (max 1 visible initially, expandable)
- Green/info flags and acknowledged flags collapsed into "History"
- Severity sort order: red > amber > green > info
- Suggested language hidden by default, toggleable
- Implementation: `src/app/(app)/dashboard/FlagPanel.tsx`

## Intake Flags

Evaluated by `evaluateIntakeFlags()` in `src/lib/scoring.ts`.

### WHO-5 Thresholds

| Condition | Severity | Rule Key | Message |
|-----------|----------|----------|---------|
| WHO5 < 28 | amber | who5_critical | Energy and mood are running very low. Worth checking in about what support they have outside of coaching. |
| WHO5 28-49 | amber | who5_concern | Energy and mood are a bit low coming in. Good to keep an eye on this as coaching progresses. |

### PHQ-4 Anxiety Thresholds

| Condition | Severity | Rule Key | Message |
|-----------|----------|----------|---------|
| Anxiety >= 6 | amber | phq4_anxiety_high | Stress and worry levels are very high. Worth exploring what's driving this and whether they have support outside coaching. |
| Anxiety 3-5 | info | phq4_anxiety | Stress levels are a bit elevated. Worth keeping an eye on. |

### PHQ-4 Depression Thresholds

| Condition | Severity | Rule Key | Message |
|-----------|----------|----------|---------|
| Depression >= 6 | amber | phq4_depression_high | Mood is running very low. Worth checking in about what support they have and whether coaching alone is enough. |
| Depression 3-5 | info | phq4_depression | Mood is a bit low. Worth keeping an eye on how this shifts over time. |

## Session Flags

Evaluated by `evaluateSessionFlags()` in `src/lib/scoring.ts`. Requires current ORS score and array of previous ORS scores.

### ORS Trend Rules

| Condition | Severity | Rule Key | Type | Message |
|-----------|----------|----------|------|---------|
| Change <= -5 from previous session | amber | ors_deterioration | trend | Noticeable dip this session. Something may have shifted -- worth exploring what happened. |
| Change >= +5 from previous session | green | ors_improvement | trend | Nice jump this session -- something clicked. |
| 3+ sessions all < 25 with < 3pt change between each | amber | ors_plateau | trend | Wellbeing has stayed low across the last few sessions without much shift. Prompt to check in about whether coaching alone is the right fit. |

### Plateau Detection Details

Triggers when ALL of the following are true:
- At least 3 consecutive sessions of ORS data (including current)
- All scores in the window are below 25
- Change between each consecutive pair is less than 3 points

## Special Flag: Graduation Signal

Rule key `graduation_signal` gets dedicated UI treatment in FlagPanel (separate card with distinct styling).

## Key Design Decisions

- No red-severity flags currently defined -- amber is the highest active severity
- Suggested language is always optional and hidden by default
- Flags use coaching tone, never clinical alarm language
- PHQ-4 data is practitioner-only and must never appear in client views
- Flag evaluation happens synchronously during score submission in `/api/score`

## Key Files

- Flag evaluation logic: `src/lib/scoring.ts` (evaluateIntakeFlags, evaluateSessionFlags)
- Flag display: `src/app/(app)/dashboard/FlagPanel.tsx`
- Flag data fetch: `src/app/api/flags/route.ts`
- Flag schema: `supabase/schema.sql` (flag table)
