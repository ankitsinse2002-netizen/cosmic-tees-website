import { NextResponse } from "next/server";

import { getCurrentUser, setSessionCookie } from "@/lib/auth/session";
import { findUserById, toPublicUser, updateUserProfile } from "@/lib/auth/store";
import { createSessionCookiePayload } from "@/lib/auth/utils";

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };

    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";

    if (!firstName || !lastName) {
      return NextResponse.json({ message: "First name and last name are required." }, { status: 400 });
    }

    const updated = await updateUserProfile({
      id: sessionUser.id,
      firstName,
      lastName,
      phone: body.phone?.trim(),
    });

    if (!updated) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const full = await findUserById(updated.id);
    if (full) {
      await setSessionCookie(createSessionCookiePayload(full));
    }

    return NextResponse.json({ user: toPublicUser(updated) });
  } catch (error) {
    console.error("[/api/auth/profile]", error);
    return NextResponse.json({ message: "Unable to update profile." }, { status: 500 });
  }
}
