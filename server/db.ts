import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, devices, epochs, rewards, InsertDevice, InsertEpoch } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getNetworkStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const deviceCount = await db.select({ count: sql`COUNT(*)` }).from(users);
    const totalStaked = await db.select({ total: sql`SUM(stakedAmount)` }).from(devices);
    const totalEarned = await db.select({ total: sql`SUM(totalEarned)` }).from(devices);
    const activeDevices = await db.select({ count: sql`COUNT(*)` }).from(devices).where(eq(devices.isActive, 1));

    return {
      deviceCount: (deviceCount[0]?.count as number) || 0,
      totalStaked: (totalStaked[0]?.total as number) || 0,
      totalEarned: (totalEarned[0]?.total as number) || 0,
      activeDevices: (activeDevices[0]?.count as number) || 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get network stats:", error);
    return null;
  }
}

export async function getLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(devices)
      .where(eq(devices.isActive, 1))
      .orderBy(desc(devices.totalEarned))
      .limit(limit);

    return result.map((device, index) => ({
      rank: index + 1,
      address: device.address,
      deviceType: device.deviceType,
      earned: device.totalEarned,
      staked: device.stakedAmount,
      reputation: device.reputation,
    }));
  } catch (error) {
    console.error("[Database] Failed to get leaderboard:", error);
    return [];
  }
}

export async function getCurrentEpoch() {
  const db = await getDb();
  if (!db) return null;

  try {
    const EPOCH_DURATION_MS = 24 * 60 * 60 * 1000;
    const GENESIS = new Date("2026-01-01T00:00:00Z").getTime();
    const now = Date.now();
    const elapsed = now - GENESIS;
    const epochNumber = Math.floor(elapsed / EPOCH_DURATION_MS) + 1;

    const epoch = await db
      .select()
      .from(epochs)
      .where(eq(epochs.epochNumber, epochNumber))
      .limit(1);

    if (epoch.length > 0) {
      return epoch[0];
    }

    // Create epoch if it doesn't exist
    const epochStart = GENESIS + (epochNumber - 1) * EPOCH_DURATION_MS;
    const epochEnd = epochStart + EPOCH_DURATION_MS;

    const newEpoch: InsertEpoch = {
      epochNumber,
      startTime: new Date(epochStart),
      endTime: new Date(epochEnd),
      deviceRewardPool: 1000,
      verifierRewardPool: 200,
      totalDistributed: 0,
    };

    await db.insert(epochs).values(newEpoch);
    return newEpoch;
  } catch (error) {
    console.error("[Database] Failed to get current epoch:", error);
    return null;
  }
}

export async function createDevice(userId: number, deviceType: string, address: string, stakedAmount: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const newDevice: InsertDevice = {
      userId,
      deviceType: deviceType as "sensor" | "gateway" | "verifier",
      address,
      stakedAmount,
      totalEarned: 0,
      reputation: 0,
      isActive: 1,
    };

    const result = await db.insert(devices).values(newDevice);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create device:", error);
    return null;
  }
}
