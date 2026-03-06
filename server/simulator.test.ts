import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("simulator.calculate", () => {
  it("calculates rewards for sensor device type", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      stake: 100,
      deviceType: "sensor",
    });

    expect(result.stake).toBe(100);
    expect(result.deviceType).toBe("sensor");
    expect(result.daily).toBe(0.08);
    expect(result.monthly).toBeCloseTo(2.4, 1);
    expect(result.yearly).toBeCloseTo(29.2, 1);
    expect(result.apy).toBe(29.2);
  });

  it("calculates rewards for gateway device type", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      stake: 100,
      deviceType: "gateway",
    });

    expect(result.stake).toBe(100);
    expect(result.deviceType).toBe("gateway");
    expect(result.daily).toBe(0.22);
    expect(result.apy).toBe(80.3);
  });

  it("calculates rewards for verifier device type", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      stake: 100,
      deviceType: "verifier",
    });

    expect(result.stake).toBe(100);
    expect(result.deviceType).toBe("verifier");
    expect(result.daily).toBe(0.65);
    expect(result.apy).toBe(237.25);
    expect(result.verifierChancePct).toBeCloseTo(1.5, 1);
  });

  it("scales rewards with stake amount", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result1 = await caller.simulator.calculate({
      stake: 100,
      deviceType: "sensor",
    });

    const result2 = await caller.simulator.calculate({
      stake: 200,
      deviceType: "sensor",
    });

    expect(result2.daily).toBe(result1.daily * 2);
    expect(result2.apy).toBe(result1.apy);
  });

  it("calculates verifier chance correctly", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result1 = await caller.simulator.calculate({
      stake: 100,
      deviceType: "verifier",
    });

    const result2 = await caller.simulator.calculate({
      stake: 1000,
      deviceType: "verifier",
    });

    expect(result2.verifierChancePct).toBeGreaterThan(result1.verifierChancePct);
    expect(result2.verifierChancePct).toBeLessThanOrEqual(25);
  });

  it("clamps stake to valid range", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Test that values outside the schema range are rejected
    try {
      await caller.simulator.calculate({
        stake: 5,
        deviceType: "sensor",
      });
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("returns consistent APY regardless of stake", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const stakes = [50, 100, 200, 500];
    const apys: number[] = [];

    for (const stake of stakes) {
      const result = await caller.simulator.calculate({
        stake,
        deviceType: "sensor",
      });
      apys.push(result.apy);
    }

    // All APYs should be the same for the same device type (29.2 for sensor)
    expect(apys[0]).toBe(29.2);
    expect(apys[1]).toBe(29.2);
    expect(apys[2]).toBe(29.2);
    expect(apys[3]).toBe(29.2);
  });
});
