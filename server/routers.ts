import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getNetworkStats, getLeaderboard, getCurrentEpoch } from "./db";

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
      const stats = await getNetworkStats();
      return stats || { deviceCount: 0, totalStaked: 0, totalEarned: 0, activeDevices: 0 };
    }),
    leaderboard: publicProcedure.query(async () => {
      return await getLeaderboard(10);
    }),
    currentEpoch: publicProcedure.query(async () => {
      const epoch = await getCurrentEpoch();
      if (!epoch) return null;
      const epochEnd = new Date(epoch.endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, epochEnd - now);
      return {
        epochNumber: epoch.epochNumber,
        startTime: epoch.startTime,
        endTime: epoch.endTime,
        remainingMs: remaining,
        deviceRewardPool: epoch.deviceRewardPool,
        verifierRewardPool: epoch.verifierRewardPool,
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
