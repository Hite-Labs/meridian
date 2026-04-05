import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Cross-instrument flag evaluation — called on dashboard load
export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json(
      { error: "clientId required" },
      { status: 400 }
    );
  }

  // Fetch all data needed for cross-instrument analysis
  const [
    { data: client },
    { data: scores },
    { data: responses },
    { data: sessions },
    { data: existingFlags },
  ] = await Promise.all([
    supabase
      .from("client")
      .select("id, name, status, modality")
      .eq("id", clientId)
      .single(),
    supabase
      .from("score")
      .select("*")
      .eq("client_id", clientId)
      .order("scored_at", { ascending: true }),
    supabase
      .from("response")
      .select("*")
      .eq("client_id", clientId)
      .order("responded_at", { ascending: true }),
    supabase
      .from("session")
      .select("*")
      .eq("client_id", clientId)
      .order("session_number", { ascending: true }),
    supabase
      .from("flag")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true }),
  ]);

  // Return all flags (seeded + computed) for the dashboard
  return NextResponse.json({
    client: client ?? { id: clientId, name: "Unknown", status: "active", modality: "subconscious" },
    flags: existingFlags ?? [],
    scores: scores ?? [],
    responses: responses ?? [],
    sessions: sessions ?? [],
  });
}
