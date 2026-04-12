import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_PRACTITIONER_ID } from "@/lib/demo";
import { createClientSchema } from "@/lib/validations/client";

// List all clients for a practitioner, with latest ORS score + active flag count
export async function GET() {
  // TODO: replace with authenticated practitioner ID
  const practitionerId = DEMO_PRACTITIONER_ID;

  const { data: clients, error } = await supabase
    .from("client")
    .select("id, name, first_name, last_name, email, phone, modality, status, goal, notes, created_at")
    .eq("practitioner_id", practitionerId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // For each client, get latest ORS score, last session date, active flag count
  const enriched = await Promise.all(
    (clients ?? []).map(async (client) => {
      const [
        { data: latestScore },
        { data: lastSession },
        { count: flagCount },
      ] = await Promise.all([
        supabase
          .from("score")
          .select("composite_score")
          .eq("client_id", client.id)
          .eq("instrument", "ORS")
          .eq("questionnaire_type", "session")
          .order("scored_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("session")
          .select("session_date")
          .eq("client_id", client.id)
          .order("session_number", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("flag")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .eq("acknowledged", false),
      ]);

      return {
        ...client,
        latestOrs: latestScore ? Number(latestScore.composite_score) : null,
        lastSessionDate: lastSession?.session_date ?? null,
        activeFlagCount: flagCount ?? 0,
      };
    })
  );

  return NextResponse.json({ clients: enriched });
}

// Create a new client
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { firstName, lastName, email, phone, notes } = parsed.data;

  // TODO: replace with authenticated practitioner ID
  const practitionerId = DEMO_PRACTITIONER_ID;

  // Get practitioner's modality to inherit
  const { data: practitioner } = await supabase
    .from("practitioner")
    .select("modality")
    .eq("id", practitionerId)
    .single();

  const name = `${firstName} ${lastName}`;

  const { data: client, error } = await supabase
    .from("client")
    .insert({
      practitioner_id: practitionerId,
      name,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      modality: practitioner?.modality ?? "subconscious",
      status: "active",
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Client creation failed:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }

  // Generate intake magic link token (7-day expiry)
  const { data: token, error: tokenError } = await supabase
    .from("client_token")
    .insert({
      client_id: client.id,
      token_type: "intake",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("token")
    .single();

  if (tokenError) {
    console.error("Token creation failed:", tokenError);
    return NextResponse.json({ error: "Failed to generate intake token" }, { status: 500 });
  }

  return NextResponse.json({
    client,
    intakeToken: token?.token ?? null,
  });
}
