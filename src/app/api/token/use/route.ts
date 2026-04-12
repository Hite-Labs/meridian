import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uuidSchema } from "@/lib/validations/client";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const parsed = uuidSchema.safeParse(body.token);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("client_token")
    .update({ used_at: new Date().toISOString() })
    .eq("token", body.token)
    .is("used_at", null)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Token not found or already used" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
