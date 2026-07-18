import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import type { AuthUser, PublicUser } from "./types";

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "users.json");

type UserStore = {
  users: AuthUser[];
};

const emptyStore: UserStore = { users: [] };

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(emptyStore, null, 2), "utf8");
  }
}

async function readStore(): Promise<UserStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(dataFile, "utf8");
  try {
    const parsed = JSON.parse(raw) as UserStore;
    if (!parsed.users || !Array.isArray(parsed.users)) {
      return emptyStore;
    }
    return parsed;
  } catch {
    return emptyStore;
  }
}

async function writeStore(store: UserStore) {
  await ensureStoreFile();
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

export function toPublicUser(user: AuthUser): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export async function findUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id: string) {
  const store = await readStore();
  return store.users.find((user) => user.id === id) || null;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const store = await readStore();
  const now = new Date().toISOString();

  const user: AuthUser = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(user);
  await writeStore(store);

  return user;
}

export async function updateUserProfile(input: {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const store = await readStore();
  const index = store.users.findIndex((user) => user.id === input.id);
  if (index === -1) return null;

  const existing = store.users[index];
  const updated: AuthUser = {
    ...existing,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    updatedAt: new Date().toISOString(),
  };

  store.users[index] = updated;
  await writeStore(store);

  return updated;
}
