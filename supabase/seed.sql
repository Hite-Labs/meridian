-- Meridian Demo Seed Data
-- Run this to reset demo data for Dr. Maya Chen + all demo clients
-- Sarah K. session 8 = ~1 week ago, counting backwards from today

-- Clean up existing demo data (order matters for FK constraints)
DELETE FROM flag WHERE client_id IN (SELECT id FROM client WHERE email IN ('sarah@demo.com','alex@demo.com','jordan@demo.com','priya@demo.com'));
DELETE FROM score WHERE client_id IN (SELECT id FROM client WHERE email IN ('sarah@demo.com','alex@demo.com','jordan@demo.com','priya@demo.com'));
DELETE FROM response WHERE client_id IN (SELECT id FROM client WHERE email IN ('sarah@demo.com','alex@demo.com','jordan@demo.com','priya@demo.com'));
DELETE FROM session WHERE client_id IN (SELECT id FROM client WHERE email IN ('sarah@demo.com','alex@demo.com','jordan@demo.com','priya@demo.com'));
DELETE FROM client WHERE email IN ('sarah@demo.com','alex@demo.com','jordan@demo.com','priya@demo.com');
DELETE FROM practitioner WHERE email = 'maya@demo.com';

-- ============================================================
-- Practitioner
-- ============================================================
INSERT INTO practitioner (id, name, email, modality, tier)
VALUES ('a1b2c3d4-0000-0000-0000-000000000001', 'Dr. Maya Chen', 'maya@demo.com', 'subconscious', 'pro');

-- ============================================================
-- Client
-- ============================================================
INSERT INTO client (id, practitioner_id, name, email, modality, status)
VALUES (
  'b2c3d4e5-0000-0000-0000-000000000001',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Sarah K.',
  'sarah@demo.com',
  'subconscious',
  'active'
);

-- ============================================================
-- Sessions (8 sessions over ~10 weeks, session 8 = 7 days ago)
-- Week 10 = 7 days ago → Week 1 = 70 days ago
-- ============================================================
INSERT INTO session (id, client_id, practitioner_id, session_number, session_date, notes) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 1, CURRENT_DATE - INTERVAL '70 days', 'First session. Sarah presented with anxiety around a career transition.'),
  ('c0000001-0000-0000-0000-000000000002', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 2, CURRENT_DATE - INTERVAL '63 days', 'Explored the roots of the anxiety. Sarah engaged well.'),
  ('c0000001-0000-0000-0000-000000000003', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 3, CURRENT_DATE - INTERVAL '56 days', 'Continued somatic work. Identified a core limiting belief.'),
  ('c0000001-0000-0000-0000-000000000004', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 4, CURRENT_DATE - INTERVAL '49 days', 'Breakthrough session. Significant emotional release and reframe.'),
  ('c0000001-0000-0000-0000-000000000005', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 5, CURRENT_DATE - INTERVAL '35 days', 'Integration work. Sarah reports feeling lighter.'),
  ('c0000001-0000-0000-0000-000000000006', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 6, CURRENT_DATE - INTERVAL '28 days', 'Consolidated gains. Worked on future self.'),
  ('c0000001-0000-0000-0000-000000000007', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 7, CURRENT_DATE - INTERVAL '21 days', 'Sarah is showing real momentum.'),
  ('c0000001-0000-0000-0000-000000000008', 'b2c3d4e5-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 8, CURRENT_DATE - INTERVAL '7 days', 'Strong session. Sarah is thriving.');

-- ============================================================
-- Intake Responses (session_id = NULL for intake)
-- ============================================================

-- WHO-5 intake (0-5 scale, "over the past week")
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 2);

-- PHQ-4 intake (0-3 scale)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4', 'phq4_q1', 'Feeling nervous, anxious, or on edge?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4', 'phq4_q2', 'Not being able to stop or control worrying?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4', 'phq4_q3', 'Feeling down, depressed, or hopeless?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4', 'phq4_q4', 'Little interest or pleasure in doing things?', 1);

-- Scaling intake (0-10 scale)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'scaling', 'scaling_clarity', 'How clear is the goal you''re bringing to coaching right now?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'scaling', 'scaling_motivation', 'How motivated are you to work on this goal?', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'scaling', 'scaling_readiness', 'How ready are you to make real changes in this area of your life?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'scaling', 'scaling_body_connection', 'How connected do you feel to your body right now?', 4);

-- ============================================================
-- Session ORS Responses
-- Distribute totals: personal + relationships + social + overall
-- Early: personal and overall lower, converge upward
-- ============================================================

-- Session 1: ORS total = 19 → 4 + 5 + 6 + 4
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 4);

-- Session 2: ORS total = 21 → 4 + 6 + 6 + 5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 3: ORS total = 22 → 5 + 6 + 6 + 5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 4: ORS total = 28 → 7 + 7 + 7 + 7 (breakthrough)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 7);

-- Session 5: ORS total = 26 → 6 + 7 + 7 + 6
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 6);

-- Session 6: ORS total = 27 → 6 + 7 + 7 + 7
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 7);

-- Session 7: ORS total = 29 → 7 + 7 + 8 + 7
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 7);

-- Session 8: ORS total = 32 → 8 + 8 + 8 + 8
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 8);

-- ============================================================
-- SRS Responses per session (healthy alliance: 8-10 range)
-- ============================================================
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  -- Session 1
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8),
  -- Session 2
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8),
  -- Session 3
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 9),
  -- Session 4
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 5
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 9),
  -- Session 6
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 7
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 9),
  -- Session 8
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10);

-- ============================================================
-- Body Safety (subconscious add-on, per session)
-- Sessions 1-3: 3, 4, 4 → Sessions 4-8: 5, 6, 7, 7, 8
-- ============================================================
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 8);

-- ============================================================
-- SUDS + VOC (subconscious add-on, per session)
-- SUDS: starts high, drops over time
-- VOC: starts low, rises over time
-- ============================================================
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  -- SUDS (0-10, 0=none, 10=highest)
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 1),
  -- VOC (1-7, completely false to completely true)
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 7);

-- ============================================================
-- Monthly Check-In Responses (month 2, ~35 days ago = around session 5)
-- Using session 5's ID as the reference point
-- ============================================================
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'scaling', 'then_test', 'Looking back, how were you feeling when we started?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'scaling', 'scaling_progress', 'How much progress have you made toward your goal?', 8),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'scaling', 'scaling_motivation', 'How motivated are you to continue working on your goal?', 9),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'scaling', 'scaling_confidence', 'How confident are you that you can maintain your progress?', 8);

-- ============================================================
-- Scores
-- ============================================================
INSERT INTO score (client_id, session_id, questionnaire_type, instrument, composite_score) VALUES
  -- Intake scores
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'WHO5', 44),        -- (2+2+3+2+2)*4 = 44
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4_anxiety', 3),  -- 2+1 = 3
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4_depression', 2), -- 1+1 = 2
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'intake', 'PHQ4_total', 5),    -- 2+1+1+1 = 5
  -- ORS per session
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'ORS', 19),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'ORS', 21),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'ORS', 22),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'ORS', 28),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'ORS', 26),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'ORS', 27),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'ORS', 29),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'ORS', 32),
  -- SRS per session
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'session', 'SRS', 16),  -- 8+8
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'session', 'SRS', 17),  -- 9+8
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'session', 'SRS', 18),  -- 9+9
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'session', 'SRS', 20),  -- 10+10
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'session', 'SRS', 18),  -- 9+9
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'session', 'SRS', 19),  -- 9+10
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000007', 'session', 'SRS', 19),  -- 10+9
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'session', 'SRS', 20),  -- 10+10
  -- Monthly WHO-5
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'monthly', 'WHO5', 64); -- (4+3+4+3+2)*4 = 64

-- ============================================================
-- Flags
-- ============================================================
INSERT INTO flag (client_id, session_id, flag_type, instrument, severity, rule_key, message, suggested_language, acknowledged, acknowledged_at, acknowledged_by) VALUES
  -- who5_concern at intake (WHO-5 = 44 < 50)
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'threshold', 'WHO5', 'amber', 'who5_concern',
   'Client''s wellbeing score suggests possible emotional difficulties. Consider checking in about their support systems.',
   'I noticed some of your responses suggest things have been a bit tough lately. I want you to know that''s completely normal, and we''ll work through this together at your pace.',
   false, NULL, NULL),

  -- phq4_anxiety at intake (anxiety subscore = 3 >= 3) — acknowledged at session 2
  ('b2c3d4e5-0000-0000-0000-000000000001', NULL, 'threshold', 'PHQ4', 'amber', 'phq4_anxiety',
   'Client''s responses suggest elevated anxiety. Consider opening a conversation about stress and worry.',
   'I''d love to spend a little time today exploring what''s been weighing on you. There''s no pressure — we''ll go at whatever pace feels right.',
   true, CURRENT_DATE - INTERVAL '63 days', 'Dr. Maya Chen'),

  -- ors_distress sessions 1-3 (all < 25)
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),

  -- ors_plateau at session 3 (19→21→22, all changes < 3, all < 25)
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'trend', 'ORS', 'amber', 'ors_plateau',
   'Progress appears to have stalled below the wellbeing threshold. Consider reviewing the coaching approach.',
   'I want to check in about how you feel things are going. Sometimes it helps to try a different angle — would you be open to exploring that?',
   false, NULL, NULL),

  -- ors_improvement at session 4 (ORS jumped from 22 to 28 = +6 >= 5)
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000004', 'trend', 'ORS', 'green', 'ors_improvement',
   'Reliable improvement this session.',
   NULL, false, NULL, NULL),

  -- cognitive_somatic_gap at session 3 (goal confidence from intake scaling_motivation=8 >= 8, body safety=4 but wait — spec says body_safety <= 3)
  -- At session 3: body_safety = 4, but at session 1 body_safety = 3. The cross-instrument flag checks across data.
  -- Using session 3 as spec indicates, with scaling_motivation=8 from intake and body_safety still low at 4
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'cross_instrument', NULL, 'amber', 'cognitive_somatic_gap',
   'Cognitive-somatic gap: client is mentally ready but body safety is low. Somatic work may be the unlocking mechanism.',
   'I notice you''re really clear on what you want to achieve, and that''s great. I''d like to also pay attention to what your body is telling us — sometimes that''s where the real shift happens.',
   false, NULL, NULL),

  -- who5_improvement at monthly (WHO-5 went from 44 to 64 = +20 >= 10)
  ('b2c3d4e5-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'trend', 'WHO5', 'green', 'who5_improvement',
   'Client''s wellbeing has improved significantly since last month.',
   NULL, false, NULL, NULL);

-- ############################################################
-- CLIENT 2: Alex R. — "Fresh Intake"
-- Just completed intake, no sessions yet
-- ############################################################

INSERT INTO client (id, practitioner_id, name, email, modality, status)
VALUES (
  'b2c3d4e5-0000-0000-0000-000000000002',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Alex R.',
  'alex@demo.com',
  'subconscious',
  'active'
);

-- Intake WHO-5 responses (raw 0-5 scale, total = 5 → score = 5*4 = 20)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 1),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 1),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 1),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 1),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 1);

-- Intake PHQ-4 responses (anxiety=6 → q1=3+q2=3, depression=3 → q3=2+q4=1)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4', 'phq4_q1', 'Feeling nervous, anxious, or on edge?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4', 'phq4_q2', 'Not being able to stop or control worrying?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4', 'phq4_q3', 'Feeling down, depressed, or hopeless?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4', 'phq4_q4', 'Little interest or pleasure in doing things?', 1);

-- Intake scaling responses
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'scaling', 'scaling_clarity', 'How clear is the goal you''re bringing to coaching right now?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'scaling', 'scaling_motivation', 'How motivated are you to work on this goal?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'scaling', 'scaling_readiness', 'How ready are you to make real changes in this area of your life?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'scaling', 'scaling_body_connection', 'How connected do you feel to your body right now?', 2);

-- Alex R. scores
INSERT INTO score (client_id, session_id, questionnaire_type, instrument, composite_score) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'WHO5', 20),           -- (1+1+1+1+1)*4 = 20
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4_anxiety', 6),     -- 3+3 = 6
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4_depression', 3),  -- 2+1 = 3
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'intake', 'PHQ4_total', 9);       -- 3+3+2+1 = 9

-- Alex R. flags
INSERT INTO flag (client_id, session_id, flag_type, instrument, severity, rule_key, message, suggested_language, acknowledged, acknowledged_at, acknowledged_by) VALUES
  -- who5_critical: WHO-5 = 20 < 28
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'threshold', 'WHO5', 'red', 'who5_critical',
   'Client''s wellbeing score is critically low. Consider screening for depression and ensuring adequate support is in place.',
   'I can see things have been really hard lately. I want to make sure you have the support you need — would it be okay to talk about that?',
   false, NULL, NULL),

  -- phq4_anxiety_high: anxiety = 6 (max)
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'threshold', 'PHQ4', 'red', 'phq4_anxiety_high',
   'Client''s anxiety screening is at the maximum level. Consider discussing anxiety management strategies and whether additional support is needed.',
   'Your responses suggest you''ve been experiencing a lot of anxiety. That''s important information — let''s make sure we address this together.',
   false, NULL, NULL),

  -- phq4_depression: depression = 3
  ('b2c3d4e5-0000-0000-0000-000000000002', NULL, 'threshold', 'PHQ4', 'amber', 'phq4_depression',
   'Client''s depression screening is elevated. Worth monitoring and opening a conversation.',
   'I also noticed some signs of low mood in your responses. How are you feeling about that?',
   false, NULL, NULL);


-- ############################################################
-- CLIENT 3: Jordan M. — "Stalled / Plateau"
-- 5 sessions, ORS flat below 25, cognitive-somatic gap
-- ############################################################

INSERT INTO client (id, practitioner_id, name, email, modality, status)
VALUES (
  'b2c3d4e5-0000-0000-0000-000000000003',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Jordan M.',
  'jordan@demo.com',
  'subconscious',
  'active'
);

-- Jordan's 5 sessions over ~5 weeks, session 5 = 7 days ago
INSERT INTO session (id, client_id, practitioner_id, session_number, session_date, notes) VALUES
  ('c0000003-0000-0000-0000-000000000001', 'b2c3d4e5-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 1, CURRENT_DATE - INTERVAL '35 days', 'First session. Jordan presented with chronic stress and burnout.'),
  ('c0000003-0000-0000-0000-000000000002', 'b2c3d4e5-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 2, CURRENT_DATE - INTERVAL '28 days', 'Explored stress patterns. Jordan is very articulate but body awareness is limited.'),
  ('c0000003-0000-0000-0000-000000000003', 'b2c3d4e5-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 3, CURRENT_DATE - INTERVAL '21 days', 'Attempted somatic work. Jordan reports understanding intellectually but not feeling shift.'),
  ('c0000003-0000-0000-0000-000000000004', 'b2c3d4e5-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 4, CURRENT_DATE - INTERVAL '14 days', 'Continued approach. Jordan is engaged but scores not moving.'),
  ('c0000003-0000-0000-0000-000000000005', 'b2c3d4e5-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 5, CURRENT_DATE - INTERVAL '7 days', 'Same pattern. Consider changing approach — conscious modality might unlock progress.');

-- Jordan intake: WHO-5 responses (raw sum = 10 → score = 10*4 = 40)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 2);

-- Jordan intake: PHQ-4 (anxiety=4 → 2+2, depression=1 → 1+0)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4', 'phq4_q1', 'Feeling nervous, anxious, or on edge?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4', 'phq4_q2', 'Not being able to stop or control worrying?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4', 'phq4_q3', 'Feeling down, depressed, or hopeless?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4', 'phq4_q4', 'Little interest or pleasure in doing things?', 0);

-- Jordan intake: Scaling (motivation=9, body_safety=2)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'scaling', 'scaling_clarity', 'How clear is the goal you''re bringing to coaching right now?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'scaling', 'scaling_motivation', 'How motivated are you to work on this goal?', 9),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'scaling', 'scaling_readiness', 'How ready are you to make real changes in this area of your life?', 8),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'scaling', 'scaling_body_connection', 'How connected do you feel to your body right now?', 3);

-- Jordan ORS responses: 18→19→20→19→20 (flat below 25)
-- Session 1: ORS = 18 → 4+5+5+4
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 4);

-- Session 2: ORS = 19 → 4+5+5+5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 3: ORS = 20 → 5+5+5+5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 4: ORS = 19 → 4+5+5+5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 5: ORS = 20 → 5+5+5+5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Jordan SRS responses (15-17 range per session)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  -- Session 1: SRS = 15 → 7+8
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8),
  -- Session 2: SRS = 16 → 8+8
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8),
  -- Session 3: SRS = 16 → 8+8
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8),
  -- Session 4: SRS = 17 → 9+8
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8),
  -- Session 5: SRS = 16 → 8+8
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 8);

-- Jordan body safety per session: 2→2→3→3→3
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3);

-- Jordan SUDS: 7→7→6→6→6, VOC: 2→2→3→3→3
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  -- SUDS
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 6),
  -- VOC
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 3);

-- Jordan scores
INSERT INTO score (client_id, session_id, questionnaire_type, instrument, composite_score) VALUES
  -- Intake scores
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'WHO5', 40),           -- (2+2+2+2+2)*4 = 40
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4_anxiety', 4),     -- 2+2 = 4
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4_depression', 1),  -- 1+0 = 1
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'intake', 'PHQ4_total', 5),       -- 2+2+1+0 = 5
  -- ORS per session: 18→19→20→19→20
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'ORS', 18),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'ORS', 19),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'ORS', 20),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'ORS', 19),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'ORS', 20),
  -- SRS per session: 15→16→16→17→16
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'session', 'SRS', 15),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'session', 'SRS', 16),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'session', 'SRS', 16),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'session', 'SRS', 17),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'session', 'SRS', 16);

-- Jordan flags
INSERT INTO flag (client_id, session_id, flag_type, instrument, severity, rule_key, message, suggested_language, acknowledged, acknowledged_at, acknowledged_by) VALUES
  -- who5_concern at intake (WHO-5 = 40 < 50)
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'threshold', 'WHO5', 'amber', 'who5_concern',
   'Client''s wellbeing score suggests possible emotional difficulties. Consider checking in about their support systems.',
   'I noticed some of your responses suggest things have been a bit tough lately. I want you to know that''s completely normal, and we''ll work through this together at your pace.',
   false, NULL, NULL),

  -- phq4_anxiety at intake (anxiety = 4 >= 3)
  ('b2c3d4e5-0000-0000-0000-000000000003', NULL, 'threshold', 'PHQ4', 'amber', 'phq4_anxiety',
   'Client''s responses suggest elevated anxiety. Consider opening a conversation about stress and worry.',
   'I''d love to spend a little time today exploring what''s been weighing on you. There''s no pressure — we''ll go at whatever pace feels right.',
   false, NULL, NULL),

  -- ors_distress on all 5 sessions (all < 25)
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000001', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000002', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, false, NULL, NULL),

  -- ors_plateau on sessions 3, 4, 5 (3+ sessions with all <25, all changes <3)
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'trend', 'ORS', 'amber', 'ors_plateau',
   'Progress appears to have stalled below the wellbeing threshold. Consider reviewing the coaching approach.',
   'I want to check in about how you feel things are going. Sometimes it helps to try a different angle — would you be open to exploring that?',
   false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000004', 'trend', 'ORS', 'amber', 'ors_plateau',
   'Progress appears to have stalled below the wellbeing threshold. Consider reviewing the coaching approach.',
   'I want to check in about how you feel things are going. Sometimes it helps to try a different angle — would you be open to exploring that?',
   false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000005', 'trend', 'ORS', 'amber', 'ors_plateau',
   'Progress appears to have stalled below the wellbeing threshold. Consider reviewing the coaching approach.',
   'I want to check in about how you feel things are going. Sometimes it helps to try a different angle — would you be open to exploring that?',
   false, NULL, NULL),

  -- cognitive_somatic_gap (motivation=9, body_safety stuck at 2-3)
  ('b2c3d4e5-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'cross_instrument', NULL, 'amber', 'cognitive_somatic_gap',
   'Cognitive-somatic gap: client is mentally ready but body safety is low. Somatic work may be the unlocking mechanism.',
   'I notice you''re really clear on what you want to achieve, and that''s great. I''d like to also pay attention to what your body is telling us — sometimes that''s where the real shift happens.',
   false, NULL, NULL);


-- ############################################################
-- CLIENT 4: Priya L. — "Ready to Graduate"
-- 10 sessions over ~5 months, steady improvement
-- ############################################################

INSERT INTO client (id, practitioner_id, name, email, modality, status)
VALUES (
  'b2c3d4e5-0000-0000-0000-000000000004',
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Priya L.',
  'priya@demo.com',
  'subconscious',
  'active'
);

-- Priya's 10 sessions over ~5 months, session 10 = 7 days ago
INSERT INTO session (id, client_id, practitioner_id, session_number, session_date, notes) VALUES
  ('c0000004-0000-0000-0000-000000000001', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 1,  CURRENT_DATE - INTERVAL '150 days', 'First session. Priya presented with self-doubt and career indecision.'),
  ('c0000004-0000-0000-0000-000000000002', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 2,  CURRENT_DATE - INTERVAL '135 days', 'Explored roots of self-doubt. Good rapport established.'),
  ('c0000004-0000-0000-0000-000000000003', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 3,  CURRENT_DATE - INTERVAL '120 days', 'Somatic work around core belief. Priya beginning to shift.'),
  ('c0000004-0000-0000-0000-000000000004', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 4,  CURRENT_DATE - INTERVAL '105 days', 'Strong session. Priya reports feeling more grounded.'),
  ('c0000004-0000-0000-0000-000000000005', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 5,  CURRENT_DATE - INTERVAL '90 days', 'Continued integration. Confidence growing.'),
  ('c0000004-0000-0000-0000-000000000006', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 6,  CURRENT_DATE - INTERVAL '75 days', 'Working on future self. Priya is thriving.'),
  ('c0000004-0000-0000-0000-000000000007', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 7,  CURRENT_DATE - INTERVAL '60 days', 'Consolidating gains. Priya reports major life decisions with confidence.'),
  ('c0000004-0000-0000-0000-000000000008', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 8,  CURRENT_DATE - INTERVAL '45 days', 'Maintenance session. All indicators positive.'),
  ('c0000004-0000-0000-0000-000000000009', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 9,  CURRENT_DATE - INTERVAL '21 days', 'Strong session. Priya is self-sustaining.'),
  ('c0000004-0000-0000-0000-000000000010', 'b2c3d4e5-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 10, CURRENT_DATE - INTERVAL '7 days', 'Final check-in. All gains maintained. Ready for graduation.');

-- Priya intake: WHO-5 (raw sum = 12 → score = 12*4 = 48)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 2),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 2);

-- Priya intake: PHQ-4 (anxiety=3 → 2+1, depression=1 → 1+0)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4', 'phq4_q1', 'Feeling nervous, anxious, or on edge?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4', 'phq4_q2', 'Not being able to stop or control worrying?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4', 'phq4_q3', 'Feeling down, depressed, or hopeless?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4', 'phq4_q4', 'Little interest or pleasure in doing things?', 0);

-- Priya intake: Scaling
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'scaling', 'scaling_clarity', 'How clear is the goal you''re bringing to coaching right now?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'scaling', 'scaling_motivation', 'How motivated are you to work on this goal?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'scaling', 'scaling_readiness', 'How ready are you to make real changes in this area of your life?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'scaling', 'scaling_body_connection', 'How connected do you feel to your body right now?', 4);

-- Priya ORS responses: 20→22→24→27→30→32→33→34→35→36
-- Session 1: ORS = 20 → 4+5+6+5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 2: ORS = 22 → 5+6+6+5
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 5);

-- Session 3: ORS = 24 → 5+6+7+6
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 6);

-- Session 4: ORS = 27 → 6+7+7+7
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 7);

-- Session 5: ORS = 30 → 7+8+8+7
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 7);

-- Session 6: ORS = 32 → 8+8+8+8
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 8);

-- Session 7: ORS = 33 → 8+8+9+8
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 8);

-- Session 8: ORS = 34 → 8+9+9+8
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 8);

-- Session 9: ORS = 35 → 9+9+9+8
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 8);

-- Session 10: ORS = 36 → 9+9+9+9
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'ORS', 'ors_personal', 'Personally — your inner sense of wellbeing right now.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'ORS', 'ors_relationships', 'In your close relationships — family, partner, friends.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'ORS', 'ors_social', 'At work, school, or in your social world.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'ORS', 'ors_overall', 'Overall — your general sense of how life is going.', 9);

-- Priya SRS responses (high throughout: 18-20)
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  -- Session 1: SRS = 18 → 9+9
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 9),
  -- Session 2: SRS = 18 → 9+9
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 9),
  -- Session 3: SRS = 19 → 10+9
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 9),
  -- Session 4: SRS = 19 → 9+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 5: SRS = 20 → 10+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 6: SRS = 20 → 10+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 7: SRS = 19 → 9+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 8: SRS = 20 → 10+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 9: SRS = 20 → 10+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10),
  -- Session 10: SRS = 20 → 10+10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'SRS', 'srs_heard', 'I felt heard and understood in today''s session.', 10),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'SRS', 'srs_relevant', 'We worked on what actually mattered to me today.', 10);

-- Priya body safety: 3→4→5→6→7→7→8→8→9→9
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 8),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 9),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'scaling', 'scaling_body_safety', 'How safe does your body feel right now?', 9);

-- Priya SUDS: 6→5→4→3→2→2→1→1→1→0, VOC: 3→4→4→5→5→6→6→7→7→7
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  -- SUDS
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 2),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 1),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'SUDS', 'suds', 'What is the level of emotional charge you still feel around the issue we worked on today?', 0),
  -- VOC
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 5),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 6),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 7),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'VOC', 'voc', 'How true does it feel in your body right now that you are safe and capable?', 7);

-- Priya monthly WHO-5 check-ins
-- Month ~2 (session 4, ~105 days ago): raw sum = 16 → score = 16*4 = 64
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'monthly', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'monthly', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'monthly', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'monthly', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 3),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'monthly', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 3);

-- Month ~4 (session 8, ~45 days ago): raw sum = 20 → score = 20*4 = 80
INSERT INTO response (client_id, session_id, questionnaire_type, instrument, question_key, question_text, value) VALUES
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'monthly', 'WHO5', 'who5_q1', 'I have felt cheerful and in good spirits.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'monthly', 'WHO5', 'who5_q2', 'I have felt calm and relaxed.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'monthly', 'WHO5', 'who5_q3', 'I have felt active and vigorous.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'monthly', 'WHO5', 'who5_q4', 'I woke up feeling fresh and rested.', 4),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'monthly', 'WHO5', 'who5_q5', 'My daily life has been filled with things that interest me.', 4);

-- Priya scores
INSERT INTO score (client_id, session_id, questionnaire_type, instrument, composite_score) VALUES
  -- Intake scores
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'WHO5', 48),           -- (3+2+3+2+2)*4 = 48
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4_anxiety', 3),     -- 2+1 = 3
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4_depression', 1),  -- 1+0 = 1
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'intake', 'PHQ4_total', 4),       -- 2+1+1+0 = 4
  -- ORS per session: 20→22→24→27→30→32→33→34→35→36
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'ORS', 20),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'ORS', 22),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'ORS', 24),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'ORS', 27),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'ORS', 30),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'ORS', 32),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'ORS', 33),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'ORS', 34),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'ORS', 35),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'ORS', 36),
  -- SRS per session: 18→18→19→19→20→20→19→20→20→20
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'session', 'SRS', 18),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'session', 'SRS', 18),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'session', 'SRS', 19),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'session', 'SRS', 19),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'session', 'SRS', 20),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000006', 'session', 'SRS', 20),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000007', 'session', 'SRS', 19),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'session', 'SRS', 20),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000009', 'session', 'SRS', 20),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'session', 'SRS', 20),
  -- Monthly WHO-5 scores
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'monthly', 'WHO5', 64),  -- (3+3+4+3+3)*4 = 64
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'monthly', 'WHO5', 80);  -- (4+4+4+4+4)*4 = 80

-- Priya flags
INSERT INTO flag (client_id, session_id, flag_type, instrument, severity, rule_key, message, suggested_language, acknowledged, acknowledged_at, acknowledged_by) VALUES
  -- who5_concern at intake (WHO-5 = 48 < 50)
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'threshold', 'WHO5', 'amber', 'who5_concern',
   'Client''s wellbeing score suggests possible emotional difficulties. Consider checking in about their support systems.',
   'I noticed some of your responses suggest things have been a bit tough lately. I want you to know that''s completely normal, and we''ll work through this together at your pace.',
   true, CURRENT_DATE - INTERVAL '135 days', 'Dr. Maya Chen'),

  -- phq4_anxiety at intake (anxiety = 3 >= 3)
  ('b2c3d4e5-0000-0000-0000-000000000004', NULL, 'threshold', 'PHQ4', 'amber', 'phq4_anxiety',
   'Client''s responses suggest elevated anxiety. Consider opening a conversation about stress and worry.',
   'I''d love to spend a little time today exploring what''s been weighing on you. There''s no pressure — we''ll go at whatever pace feels right.',
   true, CURRENT_DATE - INTERVAL '135 days', 'Dr. Maya Chen'),

  -- ors_distress sessions 1-3 (all < 25)
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000001', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, true, CURRENT_DATE - INTERVAL '135 days', 'Dr. Maya Chen'),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000002', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, true, CURRENT_DATE - INTERVAL '120 days', 'Dr. Maya Chen'),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000003', 'threshold', 'ORS', 'amber', 'ors_distress',
   'Client is in the distress range. Worth checking in at the start of next session.',
   NULL, true, CURRENT_DATE - INTERVAL '105 days', 'Dr. Maya Chen'),

  -- ors_improvement at session 4 (ORS 24→27 = +3, but need jump ≥5… check: 20→22→24→27, cumulative from session 1 = +7)
  -- Actually per spec: "sessions where jump ≥5" — session 4: 24→27=+3, session 5: 27→30=+3
  -- Cumulative from session 1: session 4 has 27-20=+7, session 5 has 30-20=+10
  -- The spec says ors_improvement green flags at sessions where jump ≥5
  -- Looking at Sarah's pattern: session 4 had 22→28=+6, that's session-over-session
  -- For Priya no single session jump is ≥5. But cumulative from first session:
  -- Session 5: 30-20=10 ≥5 → flag. Session 4: 27-20=7 ≥5 → flag.
  -- Let's use reliable change (cumulative from baseline): sessions 4, 5 onward
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'trend', 'ORS', 'green', 'ors_improvement',
   'Reliable improvement detected — client has gained 7+ points from baseline.',
   NULL, false, NULL, NULL),
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000005', 'trend', 'ORS', 'green', 'ors_improvement',
   'Reliable improvement this session.',
   NULL, false, NULL, NULL),

  -- who5_improvement at session 4 monthly (48→64 = +16 ≥ 10)
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000004', 'trend', 'WHO5', 'green', 'who5_improvement',
   'Client''s wellbeing has improved significantly since intake.',
   NULL, false, NULL, NULL),

  -- who5_improvement at session 8 monthly (64→80 = +16 ≥ 10)
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000008', 'trend', 'WHO5', 'green', 'who5_improvement',
   'Client''s wellbeing has improved significantly since last month.',
   NULL, false, NULL, NULL),

  -- graduation_signal at session 10
  ('b2c3d4e5-0000-0000-0000-000000000004', 'c0000004-0000-0000-0000-000000000010', 'trend', 'Cross-instrument', 'green', 'graduation_signal',
   'Client has maintained wellbeing scores above threshold for 2+ months. All somatic indicators resolved. Consider celebrating progress and discussing transition.',
   'You''ve made incredible progress — your scores have been consistently strong, and the changes feel grounded in your body too. I think it''s worth celebrating how far you''ve come and talking about what comes next.',
   false, NULL, NULL);
