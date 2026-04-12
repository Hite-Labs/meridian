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
      { error: "No phone number on file. Add a phone number to send SMS invites." },
      { status: 400 }
    );
  }

  // Get practitioner name
  const { data: practitioner } = await supabase
    .from("practitioner")
    .select("name")
    .eq("id", client.practitioner_id)
    .single();

  // Look up existing valid intake token
  const { data: existingToken } = await supabase
    .from("client_token")
    .select("token, expires_at, used_at")
    .eq("client_id", clientId)
    .eq("token_type", "intake")
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let intakeToken: string;

  if (existingToken && new Date(existingToken.expires_at) > new Date()) {
    // Reuse existing valid token
    intakeToken = existingToken.token;
  } else {
    // Generate a new intake token (7-day expiry)
    const { data: newToken, error: tokenError } = await supabase
      .from("client_token")
      .insert({
        client_id: clientId,
        token_type: "intake",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("token")
      .single();

    if (tokenError || !newToken) {
      console.error("Token creation failed:", tokenError);
      return NextResponse.json({ error: "Failed to generate intake link" }, { status: 500 });
    }
    intakeToken = newToken.token;
  }

  // Build the magic link URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
  const intakeUrl = `${baseUrl}/intake?token=${intakeToken}`;

  // Send SMS via Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
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
      body: `Hi ${client.first_name} — ${practName} has invited you to begin your coaching journey. Tap here to get started: ${intakeUrl}`,
      from: fromNumber,
      to: client.phone,
    });
  } catch (err) {
    console.error("Twilio SMS failed:", err);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
