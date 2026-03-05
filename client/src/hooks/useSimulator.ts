/**
 * Staking reward simulator: deterministic formulas for daily/monthly/APY
 * based on stake, device type, reputation, and demand index.
 * Used by the Simulator page and the demo sandbox (no server required).
 */

export type DeviceType = "sensor" | "gateway" | "verifier";

export interface SimulatorInput {
  stake: number;
  deviceType: DeviceType;
  /** Reputation score 0–100; default 50 (neutral multiplier). */
  reputation?: number;
  /** Demand multiplier; default 1. */
  demandIndex?: number;
}

export interface SimulatorResult {
  daily: number;
  monthly: number;
  yearly: number;
  apy: number;
  /** Only set for deviceType === "verifier". */
  verifierChancePct?: number;
}

const BASE_RATES: Record<DeviceType, number> = {
  sensor: 0.05,
  gateway: 0.15,
  verifier: 0.5,
};

/**
 * Deterministic simulation: daily = baseRate * (stake/100) * (1 + (reputation-50)/200) * demandIndex.
 * monthly = daily * 30, yearly = daily * 365, apy = (yearly / stake) * 100.
 *
 * @param input - stake, deviceType, optional reputation (default 50), demandIndex (default 1)
 * @returns daily, monthly, yearly, apy; verifierChancePct for verifier only
 */
export function simulate(input: SimulatorInput): SimulatorResult {
  const {
    stake,
    deviceType,
    reputation = 50,
    demandIndex = 1,
  } = input;

  const baseRate = BASE_RATES[deviceType] ?? 0.05;
  const reputationMultiplier = 1 + (reputation - 50) / 200;
  const daily =
    baseRate * (stake / 100) * reputationMultiplier * demandIndex;
  const monthly = daily * 30;
  const yearly = daily * 365;
  const apy = stake > 0 ? (yearly / stake) * 100 : 0;

  const result: SimulatorResult = {
    daily: round(daily, 4),
    monthly: round(monthly, 4),
    yearly: round(yearly, 4),
    apy: round(apy, 2),
  };

  if (deviceType === "verifier") {
    result.verifierChancePct = round(
      Math.min(15, (stake / 1000) * 10),
      1
    );
  }

  return result;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * React hook that returns simulated rewards for the given input.
 * Recomputes when input changes; safe to use in demo sandbox (no network).
 */
export function useSimulator(input: SimulatorInput): SimulatorResult {
  return simulate(input);
}
