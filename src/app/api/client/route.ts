import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Update a client's self-reported coaching goal.
export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const clientId = body?.clientId;
  const goal = body?.goal;

  if (typeof clientId !== "string" || !clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }
  if (typeof goal !== "string") {
    return NextResponse.json({ error: "goal must be a string" }, { status: 400 });
  }

  const trimmed = goal.trim();

  const { data, error } = await supabase
    .from("client")
    .update({ goal: trimmed.length > 0 ? trimmed : null })
    .eq("id", clientId)
    .select("goal")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, goal: data?.goal ?? null });
}
