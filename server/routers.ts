import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Mock data for demo
const MOCK_LEADERS = [
  { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc9e7595f", deviceType: "verifier" as const, earned: 2847.5, staked: 1000, reputation: 98 },
  { rank: 2, address: "0x8f3Cf7ad23Cd3CaDbD9735AFF958023D8", deviceType: "gateway" as const, earned: 2156.3, staked: 750, reputation: 95 },
  { rank: 3, address: "0x1234567890abcdef1234567890abcdef12", deviceType: "verifier" as const, earned: 1987.2, staked: 950, reputation: 92 },
  { rank: 4, address: "0xabcdef1234567890abcdef1234567890ab", deviceType: "gateway" as const, earned: 1654.8, staked: 680, reputation: 88 },
  { rank: 5, address: "0x5678901234567890abcdef1234567890ab", deviceType: "sensor" as const, earned: 1432.1, staked: 500, reputation: 85 },
  { rank: 6, address: "0x9876543210fedcba9876543210fedcba98", deviceType: "verifier" as const, earned: 1298.6, staked: 920, reputation: 91 },
  { rank: 7, address: "0xfedcba9876543210fedcba9876543210fe", deviceType: "gateway" as const, earned: 1156.4, staked: 720, reputation: 87 },
  { rank: 8, address: "0x1111111111111111111111111111111111", deviceType: "sensor" as const, earned: 987.3, staked: 450, reputation: 82 },
  { rank: 9, address: "0x2222222222222222222222222222222222", deviceType: "gateway" as const, earned: 876.5, staked: 650, reputation: 84 },
  { rank: 10, address: "0x3333333333333333333333333333333333", deviceType: "verifier" as const, earned: 765.2, staked: 880, reputation: 89 },
  { rank: 11, address: "0x4444444444444444444444444444444444", deviceType: "sensor" as const, earned: 654.8, staked: 380, reputation: 79 },
  { rank: 12, address: "0x5555555555555555555555555555555555", deviceType: "gateway" as const, earned: 543.1, staked: 600, reputation: 81 },
  { rank: 13, address: "0x6666666666666666666666666666666666", deviceType: "sensor" as const, earned: 432.7, staked: 320, reputation: 76 },
  { rank: 14, address: "0x7777777777777777777777777777777777", deviceType: "verifier" as const, earned: 398.2, staked: 750, reputation: 86 },
  { rank: 15, address: "0x8888888888888888888888888888888888", deviceType: "gateway" as const, earned: 356.9, staked: 550, reputation: 80 },
  { rank: 16, address: "0x9999999999999999999999999999999999", deviceType: "sensor" as const, earned: 298.4, staked: 280, reputation: 73 },
  { rank: 17, address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", deviceType: "gateway" as const, earned: 267.1, staked: 500, reputation: 78 },
  { rank: 18, address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", deviceType: "sensor" as const, earned: 234.6, staked: 250, reputation: 71 },
  { rank: 19, address: "0xcccccccccccccccccccccccccccccccccc", deviceType: "verifier" as const, earned: 198.3, staked: 650, reputation: 83 },
  { rank: 20, address: "0xdddddddddddddddddddddddddddddddddd", deviceType: "sensor" as const, earned: 156.8, staked: 200, reputation: 68 },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  network: router({
    stats: publicProcedure.query(async () => {
      return {
        deviceCount: 1247,
        totalEarned: 45832.5,
        activeDevices: 1200,
        totalStaked: 185420,
      };
    }),
    leaderboard: publicProcedure.query(async () => {
      return MOCK_LEADERS;
    }),
    currentEpoch: publicProcedure.query(async () => {
      const now = Date.now();
      const epochEnd = new Date();
      epochEnd.setHours(epochEnd.getHours() + 1);
      epochEnd.setMinutes(Math.floor(Math.random() * 60));
      const remaining = epochEnd.getTime() - now;

      return {
        epochNumber: 62,
        startTime: new Date(now - 86400000),
        endTime: epochEnd,
        remainingMs: remaining,
        deviceRewardPool: 1000,
        verifierRewardPool: 500,
      };
    }),
  }),

  simulator: router({
    calculate: publicProcedure
      .input(z.object({
        stake: z.number().min(10).max(1000),
        deviceType: z.enum(["sensor", "gateway", "verifier"]),
      }))
      .query(({ input }) => {
        const BASE_RATES: Record<string, number> = {
          sensor: 0.05,
          gateway: 0.15,
          verifier: 0.50,
        };
        const baseRate = BASE_RATES[input.deviceType] ?? 0.05;
        const daily = baseRate * (input.stake / 100);
        const monthly = daily * 30;
        const yearly = daily * 365;
        const apy = (yearly / input.stake) * 100;
        const verifierChance = Math.min(15, (input.stake / 1000) * 10);
        return {
          stake: input.stake,
          deviceType: input.deviceType,
          daily: parseFloat(daily.toFixed(4)),
          monthly: parseFloat(monthly.toFixed(4)),
          yearly: parseFloat(yearly.toFixed(4)),
          apy: parseFloat(apy.toFixed(2)),
          verifierChancePct: parseFloat(verifierChance.toFixed(1)),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
