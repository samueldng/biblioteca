import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginSchema } from "@/core/dtos/auth.dto";
import { LoginService, AuthError } from "@/core/services/LoginService";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await LoginService.execute(data);
    const token = await createSessionToken({
      sub: user.id,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos.", issues: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: "Erro interno ao autenticar." }, { status: 500 });
  }
}
