export type AuthUser = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = Omit<AuthUser, "passwordHash">;

export type SessionPayload = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
};
