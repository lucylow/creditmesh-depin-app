import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Enhanced mock data for hackathon demo
const MOCK_LEADERS = [
  { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc9e7595f", deviceType: "verifier" as const, earned: 28475.8, staked: 85000, reputation: 99 },
  { rank: 2, address: "0x8f3Cf7ad23Cd3CaDbD9735AFF958023D8", deviceType: "gateway" as const, earned: 24156.3, staked: 78000, reputation: 98 },
  { rank: 3, address: "0x1234567890abcdef1234567890abcdef12", deviceType: "verifier" as const, earned: 21987.2, staked: 72000, reputation: 97 },
  { rank: 4, address: "0xabcdef1234567890abcdef1234567890ab", deviceType: "gateway" as const, earned: 18654.8, staked: 65000, reputation: 96 },
  { rank: 5, address: "0x5678901234567890abcdef1234567890ab", deviceType: "sensor" as const, earned: 16432.1, staked: 58000, reputation: 95 },
  { rank: 6, address: "0x9876543210fedcba9876543210fedcba98", deviceType: "verifier" as const, earned: 15298.6, staked: 52000, reputation: 94 },
  { rank: 7, address: "0xfedcba9876543210fedcba9876543210fe", deviceType: "gateway" as const, earned: 14156.4, staked: 47000, reputation: 93 },
  { rank: 8, address: "0x1111111111111111111111111111111111", deviceType: "sensor" as const, earned: 12987.3, staked: 42000, reputation: 92 },
  { rank: 9, address: "0x2222222222222222222222222222222222", deviceType: "gateway" as const, earned: 11876.5, staked: 38000, reputation: 91 },
  { rank: 10, address: "0x3333333333333333333333333333333333", deviceType: "verifier" as const, earned: 10765.2, staked: 34000, reputation: 90 },
  { rank: 11, address: "0x4444444444444444444444444444444444", deviceType: "sensor" as const, earned: 9654.8, staked: 30000, reputation: 89 },
  { rank: 12, address: "0x5555555555555555555555555555555555", deviceType: "gateway" as const, earned: 8543.1, staked: 26000, reputation: 88 },
  { rank: 13, address: "0x6666666666666666666666666666666666", deviceType: "sensor" as const, earned: 7432.7, staked: 23000, reputation: 87 },
  { rank: 14, address: "0x7777777777777777777777777777777777", deviceType: "verifier" as const, earned: 6398.2, staked: 20000, reputation: 86 },
  { rank: 15, address: "0x8888888888888888888888888888888888", deviceType: "gateway" as const, earned: 5356.9, staked: 17500, reputation: 85 },
  { rank: 16, address: "0x9999999999999999999999999999999999", deviceType: "sensor" as const, earned: 4298.4, staked: 15000, reputation: 84 },
  { rank: 17, address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", deviceType: "gateway" as const, earned: 3267.1, staked: 12500, reputation: 83 },
  { rank: 18, address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", deviceType: "sensor" as const, earned: 2234.6, staked: 10500, reputation: 82 },
  { rank: 19, address: "0xcccccccccccccccccccccccccccccccccc", deviceType: "verifier" as const, earned: 1198.3, staked: 8500, reputation: 81 },
  { rank: 20, address: "0xdddddddddddddddddddddddddddddddddd", deviceType: "sensor" as const, earned: 856.8, staked: 7000, reputation: 80 },
  { rank: 21, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", deviceType: "gateway" as const, earned: 724.2, staked: 5500, reputation: 79 },
  { rank: 22, address: "0xffffffffffffffffffffffffffffffff", deviceType: "verifier" as const, earned: 647.6, staked: 5000, reputation: 78 },
  { rank: 23, address: "0x1010101010101010101010101010101010", deviceType: "sensor" as const, earned: 556.3, staked: 4500, reputation: 77 },
  { rank: 24, address: "0x2020202020202020202020202020202020", deviceType: "gateway" as const, earned: 487.2, staked: 4000, reputation: 76 },
  { rank: 25, address: "0x3030303030303030303030303030303030", deviceType: "sensor" as const, earned: 398.4, staked: 3500, reputation: 75 },
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
        deviceCount: 4847,
        totalEarned: 487542.8,
        activeDevices: 4847,
        totalStaked: 2847650,
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
        epochNumber: 287,
        startTime: new Date(now - 86400000),
        endTime: epochEnd,
        remainingMs: remaining,
        deviceRewardPool: 5000,
        verifierRewardPool: 2500,
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
          sensor: 0.08,
          gateway: 0.22,
          verifier: 0.65,
        };
        const baseRate = BASE_RATES[input.deviceType] ?? 0.08;
        const daily = baseRate * (input.stake / 100);
        const monthly = daily * 30;
        const yearly = daily * 365;
        const apy = (yearly / input.stake) * 100;
        const verifierChance = Math.min(25, (input.stake / 1000) * 15);
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
