import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // identifier can be email or username

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Zadejte přihlašovací jméno/email a heslo." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanIdentifier }, { username: identifier.trim() }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nesprávné přihlašovací údaje." },
        { status: 401 }
      );
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Nesprávné přihlašovací údaje." },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = createToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    setSessionCookie(res.headers, token);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Chyba při přihlašování." }, { status: 500 });
  }
}
