import { describe, expect, it } from "vitest";
import { simulate } from "@/hooks/useSimulator";

describe("useSimulator / simulate", () => {
  it("returns daily 0.05 for stake=100, sensor, rep=50", () => {
    const result = simulate({
      stake: 100,
      deviceType: "sensor",
      reputation: 50,
    });
    expect(result.daily).toBe(0.05);
    expect(result.monthly).toBeCloseTo(1.5, 2);
    expect(result.yearly).toBeCloseTo(18.25, 2);
    expect(result.apy).toBe(18.25);
  });

  it("defaults reputation to 50 and demandIndex to 1", () => {
    const result = simulate({ stake: 100, deviceType: "sensor" });
    expect(result.daily).toBe(0.05);
  });

  it("calculates gateway base rate correctly", () => {
    const result = simulate({
      stake: 100,
      deviceType: "gateway",
      reputation: 50,
    });
    expect(result.daily).toBe(0.15);
    expect(result.monthly).toBeCloseTo(4.5, 2);
    expect(result.apy).toBe(54.75);
  });

  it("calculates verifier base rate and verifierChancePct", () => {
    const result = simulate({
      stake: 100,
      deviceType: "verifier",
      reputation: 50,
    });
    expect(result.daily).toBe(0.5);
    expect(result.monthly).toBeCloseTo(15, 2);
    expect(result.apy).toBe(182.5);
    expect(result.verifierChancePct).toBeCloseTo(1, 1);
  });

  it("scales daily with stake", () => {
    const r100 = simulate({ stake: 100, deviceType: "sensor", reputation: 50 });
    const r200 = simulate({ stake: 200, deviceType: "sensor", reputation: 50 });
    expect(r200.daily).toBe(r100.daily * 2);
    expect(r200.apy).toBe(r100.apy);
  });

  it("applies reputation multiplier: rep 70 increases daily", () => {
    const r50 = simulate({ stake: 100, deviceType: "sensor", reputation: 50 });
    const r70 = simulate({ stake: 100, deviceType: "sensor", reputation: 70 });
    // 1 + (70-50)/200 = 1.1
    expect(r70.daily).toBeCloseTo(r50.daily * 1.1, 4);
  });

  it("applies demandIndex multiplier", () => {
    const r1 = simulate({
      stake: 100,
      deviceType: "sensor",
      reputation: 50,
      demandIndex: 1,
    });
    const r2 = simulate({
      stake: 100,
      deviceType: "sensor",
      reputation: 50,
      demandIndex: 2,
    });
    expect(r2.daily).toBe(r1.daily * 2);
  });

  it("returns consistent results for same inputs (deterministic)", () => {
    const input = { stake: 250, deviceType: "gateway" as const, reputation: 60 };
    const a = simulate(input);
    const b = simulate(input);
    expect(a.daily).toBe(b.daily);
    expect(a.monthly).toBe(b.monthly);
    expect(a.apy).toBe(b.apy);
  });

  it("caps verifierChancePct at 15", () => {
    const result = simulate({
      stake: 2000,
      deviceType: "verifier",
      reputation: 50,
    });
    expect(result.verifierChancePct).toBeLessThanOrEqual(15);
  });

  it("handles zero stake without division issues", () => {
    const result = simulate({
      stake: 0,
      deviceType: "sensor",
      reputation: 50,
    });
    expect(result.apy).toBe(0);
    expect(result.daily).toBe(0);
  });
});
