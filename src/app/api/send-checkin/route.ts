import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_PRACTITIONER_ID } from "@/lib/demo";
import { uuidSchema } from "@/lib/validations/client";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.clientId) {
    return NextResponse.json({ error: "clientId is required" }, { status: 400 });
  }

  const parsed = uuidSchema.safeParse(body.clientId);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
  }

  const clientId = body.clientId;

  // Fetch client and practitioner info
  const { data: client, error: clientError } = await supabase
    .from("client")
    .select("id, first_name, phone, practitioner_id")
    .eq("id", clientId)
    .eq("practitioner_id", DEMO_PRACTITIONER_ID)
    .is("archived_at", null)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!client.phone) {
    return NextResponse.json(
      { error: "No phone number on file. Add a phone number to send SMS check-ins." },
      { status: 400 }
    );
  }

  // Get practitioner name for SMS
  const { data: practitioner } = await supabase
    .from("practitioner")
    .select("name")
    .eq("id", client.practitioner_id)
    .single();

  // Get the next session number
  const { data: lastSession } = await supabase
    .from("session")
    .select("session_number")
    .eq("client_id", clientId)
    .order("session_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSessionNumber = (lastSession?.session_number ?? 0) + 1;

  // Create the session record
  const { data: session, error: sessionError } = await supabase
    .from("session")
    .insert({
      client_id: clientId,
      practitioner_id: DEMO_PRACTITIONER_ID,
      session_number: nextSessionNumber,
      session_date: new Date().toISOString().split("T")[0],
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    console.error("Session creation failed:", sessionError);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  // Generate check-in magic link token (48-hour expiry)
  const { data: tokenRecord, error: tokenError } = await supabase
    .from("client_token")
    .insert({
      client_id: clientId,
      token_type: "session_checkin",
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    })
    .select("token")
    .single();

  if (tokenError || !tokenRecord) {
    console.error("Token creation failed:", tokenError);
    return NextResponse.json({ error: "Failed to generate check-in link" }, { status: 500 });
  }

  // Build the magic link URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const checkinUrl = `${baseUrl}/check-in?token=${tokenRecord.token}`;

  // Send SMS via Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error("Twilio credentials not configured");
    return NextResponse.json(
      { error: "SMS sending is not configured. Please add Twilio credentials." },
      { status: 500 }
    );
  }

  try {
    const twilio = (await import("twilio")).default;
    const twilioClient = twilio(accountSid, authToken);

    const practName = practitioner?.name ?? "Your coach";

    await twilioClient.messages.create({
      body: `Hi ${client.first_name} — ${practName} has sent your session check-in. Tap here to complete it (takes under 60 seconds): ${checkinUrl}`,
      from: fromNumber,
      to: client.phone,
    });
  } catch (err) {
    console.error("Twilio SMS failed:", err);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    sessionId: session.id,
    sessionNumber: nextSessionNumber,
  });
}
