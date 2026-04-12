import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uuidSchema } from "@/lib/validations/client";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ valid: false, reason: "Token is required" }, { status: 400 });
  }

  const parsed = uuidSchema.safeParse(token);
  if (!parsed.success) {
    return NextResponse.json({ valid: false, reason: "Invalid token format" }, { status: 400 });
  }

  // Look up token and join through client to get practitioner name
  const { data: tokenRecord, error } = await supabase
    .from("client_token")
    .select(`
      id,
      client_id,
      token_type,
      expires_at,
      used_at,
      client:client_id (
        id,
        first_name,
        practitioner:practitioner_id (
          name
        )
      )
    `)
    .eq("token", token)
    .single();

  if (error || !tokenRecord) {
    return NextResponse.json({ valid: false, reason: "Token not found" }, { status: 404 });
  }

  // Check if already used
  if (tokenRecord.used_at) {
    return NextResponse.json({ valid: false, reason: "This link has already been used" });
  }

  // Check if expired
  if (new Date(tokenRecord.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: "This link has expired" });
  }

  const client = tokenRecord.client as unknown as { id: string; first_name: string; practitioner: { name: string } };

  return NextResponse.json({
    valid: true,
    clientId: tokenRecord.client_id,
    tokenType: tokenRecord.token_type,
    clientFirstName: client?.first_name ?? null,
    practitionerName: client?.practitioner?.name ?? null,
  });
}
