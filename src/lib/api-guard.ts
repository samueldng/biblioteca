import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { SessionPayload } from "@/lib/auth";

type GuardResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; response: NextResponse };

export async function requireSession(): Promise<GuardResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  }
  return { ok: true, session };
}

export async function requireAdmin(): Promise<GuardResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  }
  if (session.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Acesso restrito ao bibliotecário." }, { status: 403 }),
    };
  }
  return { ok: true, session };
}
