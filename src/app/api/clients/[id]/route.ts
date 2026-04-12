import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEMO_PRACTITIONER_ID } from "@/lib/demo";
import { uuidSchema, updateClientSchema } from "@/lib/validations/client";

type RouteContext = { params: Promise<{ id: string }> };

// Get a single client by ID
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
  }

  const { data: client, error } = await supabase
    .from("client")
    .select("*")
    .eq("id", id)
    .eq("practitioner_id", DEMO_PRACTITIONER_ID)
    .is("archived_at", null)
    .single();

  if (error || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

// Update client fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = updateClientSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const data = parsed.data;

  // Build snake_case update object
  const updateObj: Record<string, unknown> = {};
  if (data.firstName !== undefined) updateObj.first_name = data.firstName;
  if (data.lastName !== undefined) updateObj.last_name = data.lastName;
  if (data.email !== undefined) updateObj.email = data.email;
  if (data.phone !== undefined) updateObj.phone = data.phone || null;
  if (data.notes !== undefined) updateObj.notes = data.notes || null;
  if (data.goal !== undefined) updateObj.goal = data.goal || null;
  if (data.status !== undefined) updateObj.status = data.status;
  if (data.modality !== undefined) updateObj.modality = data.modality;

  // Recompute name if first or last name changed
  if (data.firstName !== undefined || data.lastName !== undefined) {
    if (data.firstName !== undefined && data.lastName !== undefined) {
      updateObj.name = `${data.firstName} ${data.lastName}`;
    } else {
      // Fetch current values for the half that's not changing
      const { data: current } = await supabase
        .from("client")
        .select("first_name, last_name")
        .eq("id", id)
        .single();
      if (current) {
        const first = data.firstName ?? current.first_name;
        const last = data.lastName ?? current.last_name;
        updateObj.name = `${first} ${last}`;
      }
    }
  }

  const { data: client, error } = await supabase
    .from("client")
    .update(updateObj)
    .eq("id", id)
    .eq("practitioner_id", DEMO_PRACTITIONER_ID)
    .is("archived_at", null)
    .select()
    .single();

  if (error || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

// Soft delete (archive) a client
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
  }

  const { data: client, error } = await supabase
    .from("client")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id)
    .eq("practitioner_id", DEMO_PRACTITIONER_ID)
    .is("archived_at", null)
    .select("id")
    .single();

  if (error || !client) {
    return NextResponse.json({ error: "Client not found or already archived" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
