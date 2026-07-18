import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { findUserById, toPublicUser } from "./store";
import type { SessionPayload } from "./types";

const sessionCookieName = "cosmic_session";
const sessionExpirySeconds = 60 * 60 * 24 * 7;

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (secret) return new TextEncoder().encode(secret);

  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("cosmic-dev-session-secret-change-in-prod");
  }

  throw new Error("AUTH_SESSION_SECRET is missing");
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionExpirySeconds}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSessionSecret());
  return payload as unknown as SessionPayload;
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const jar = await cookies();

  jar.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: sessionExpirySeconds,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(sessionCookieName);
}

export async function getSessionPayload() {
  const jar = await cookies();
  const token = jar.get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSessionPayload();
  if (!session?.sub) return null;

  const user = await findUserById(session.sub);
  if (!user) return null;
  return toPublicUser(user);
}
