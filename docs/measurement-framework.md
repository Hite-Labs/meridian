# Measurement Framework

## Instruments

### Intake Questionnaire

Administered once at onboarding. Defined in `src/lib/questions.ts` (intakeQuestions).

| Instrument | Items | Scale | Composite Range | What It Measures |
|------------|-------|-------|-----------------|------------------|
| ORS | 4 | 0-10 | 0-40 | Baseline wellbeing across 4 life domains |
| WHO-5 | 5 | 0-5 | 0-100 (sum x4) | Energy and mood baseline |
| PHQ-4 | 4 | 0-3 | 0-12 total | Anxiety (q1+q2, 0-6) and depression (q3+q4, 0-6) screening |

Optional open-ended question: "What brings you to coaching right now?"

### Session Check-In Questionnaire

Administered after each session. Defined in `src/lib/questions.ts` (sessionQuestions).

| Instrument | Items | Scale | Composite Range | What It Measures |
|------------|-------|-------|-----------------|------------------|
| ORS | 4 | 0-10 | 0-40 | Current wellbeing (same 4 domains as intake) |
| SRS | 2 | 0-10 | 0-20 | Session alliance (felt heard + worked on what mattered) |
| SUDS | 1 | 0-10 | 0-10 | Emotional charge (subconscious modality only) |
| VOC | 1 | 1-7 | 1-7 | Body belief -- safety/capability (subconscious modality only) |

### ORS Domains (4 items, all questionnaires)

| Key | Domain | Labels |
|-----|--------|--------|
| ors_personal | Inner wellbeing | "Struggling" (0) to "Thriving" (10) |
| ors_relationships | Family/partner/friends | "Struggling" to "Thriving" |
| ors_social | Work/school/social world | "Struggling" to "Thriving" |
| ors_overall | General sense of life | "Struggling" to "Thriving" |

### Display Labels

Defined in `src/lib/labels.ts`:

| Instrument | Display Name |
|------------|-------------|
| ORS | Session Wellbeing |
| WHO5 | Monthly Wellbeing |
| SRS | Session Alliance |
| PHQ4 | Mood Screening |
| SUDS | Emotional Charge |
| VOC | Body Belief |

## Scoring Logic

All scoring in `src/lib/scoring.ts`.

### computeIntakeScores(responses)

| Score | Calculation | Range |
|-------|-------------|-------|
| ORS | ors_personal + ors_relationships + ors_social + ors_overall | 0-40 |
| WHO5 | (who5_q1 + who5_q2 + who5_q3 + who5_q4 + who5_q5) x 4 | 0-100 |
| PHQ4_anxiety | phq4_q1 + phq4_q2 | 0-6 |
| PHQ4_depression | phq4_q3 + phq4_q4 | 0-6 |
| PHQ4_total | anxiety + depression | 0-12 |

### computeSessionScores(responses)

| Score | Calculation | Range |
|-------|-------------|-------|
| ORS | Sum of 4 ORS items | 0-40 |
| SRS | srs_heard + srs_relevant | 0-20 |
| SUDS | Single value (stored as-is) | 0-10 |
| VOC | Single value (stored as-is) | 1-7 |

## Data Flow

1. Client completes questionnaire via `QuestionnaireFlow` component (one question per screen)
2. `POST /api/score` receives `{ clientId, sessionId, questionnaireType, responses, questions }`
3. Individual responses written to `response` table (rating-type only)
4. Composite scores computed based on questionnaire type
5. Scores written to `score` table (one row per instrument)
6. Flags evaluated against scores + historical data (see flag-rules.md)
7. Flags written to `flag` table
8. Response: `{ success: true, scores, flags }`

## Storage

- **response** table: One row per question answered (question_key, value, instrument)
- **score** table: One row per composite score (instrument, composite_score)
- session_id is NULL for intake responses/scores

## Key Files

- Question definitions: `src/lib/questions.ts`
- Scoring algorithms: `src/lib/scoring.ts`
- Display labels: `src/lib/labels.ts`
- Score API: `src/app/api/score/route.ts`
- Questionnaire UI: `src/components/QuestionnaireFlow.tsx`
- Seed data (demo trajectories): `supabase/seed.sql`
