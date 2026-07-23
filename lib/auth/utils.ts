import type { AuthUser, SessionPayload } from "./types";

export function createSessionCookiePayload(user: AuthUser): SessionPayload {
  return {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
