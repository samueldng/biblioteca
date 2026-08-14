import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "iema_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

// JWT_SECRET é um alias legado: é o nome sob o qual o segredo foi provisionado
// na Vercel. Padronizar tudo em SESSION_SECRET e remover o alias depois.
function getSecretKey() {
  const secret = process.env.SESSION_SECRET ?? process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string;
  name: string;
  role: "ADMIN" | "STUDENT";
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_MAX_AGE = SESSION_DURATION_SECONDS;
