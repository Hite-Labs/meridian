# Story 9: Twilio SMS End-to-End Testing

**As a practitioner, I want to verify that SMS delivery works correctly before going live with real clients.**

## Priority
MVP — must verify before first live client engagement.

## Context
Stories 2 and 3 wired up intake invites and session check-ins to send via Twilio SMS. The toll-free number (+18449190848) is pending verification. This story covers testing the full SMS flow using Twilio test credentials, then switching to live once verified.

## Testing with Test Credentials

### Setup
1. Go to **Twilio Console → Account → API keys & tokens → Test Credentials**
2. Copy the Test Account SID and Test Auth Token
3. Update `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=<test account SID>
   TWILIO_AUTH_TOKEN=<test auth token>
   TWILIO_PHONE_NUMBER=+15005550006
   ```
   `+15005550006` is Twilio's magic test "from" number that always succeeds.

### Test Cases

#### Happy Path
1. Create a client with phone number `+15005550006`
2. Click "Send Intake Invite" → API returns success
3. Click "Send Check-in" (on a client with intake) → API returns success
4. Verify tokens created in Supabase with correct types and expiry

#### Error Cases
- Client with phone `+15005550001` → simulates invalid number error
- Client with no phone → returns "No phone number on file" error

#### Token Flow
1. Send intake invite → get token from DB
2. Open `/intake?token=<token>` → questionnaire loads with practitioner name
3. Complete questionnaire → token marked as `used_at`
4. Open same link again → "This link has already been used"

### Twilio Test Credentials Docs
https://www.twilio.com/docs/iam/test-credentials

## Go Live Checklist

Once toll-free number is verified:
- [ ] Swap `.env.local` back to live credentials
- [ ] Update Vercel env vars to live credentials (if different from what's set)
- [ ] Send a real SMS to your own phone number to verify delivery
- [ ] Check SMS content — practitioner name, link, coaching tone
- [ ] Click the link in the SMS — verify it opens the correct page
- [ ] Complete the questionnaire — verify scores appear on dashboard
- [ ] Verify token is marked as used after submission

## Acceptance Criteria
- [ ] Test credentials return success for valid test numbers
- [ ] Error handling works for invalid numbers
- [ ] Full intake flow works: SMS → link → questionnaire → scores on dashboard
- [ ] Full check-in flow works: SMS → link → questionnaire → scores + flags on dashboard
- [ ] Live SMS delivers within 30 seconds after toll-free verification

## Verification & Automated Checks

- [ ] `npm run build` — production build passes
- [ ] `npx playwright test e2e/story-2-*.spec.ts e2e/story-3-*.spec.ts` — existing E2E tests pass
- [ ] Manual: test with Twilio test credentials (see steps above)
- [ ] Manual: test with live credentials after toll-free verification
