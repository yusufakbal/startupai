export const PLANS = {
  free: {
    name: "Free",
    maxStartups: 2,
    maxAnalysesPerMonth: 4,
    maxRoadmapsPerMonth: 2,
  },
  pro: {
    name: "Pro",
    maxStartups: Infinity,
    maxAnalysesPerMonth: Infinity,
    maxRoadmapsPerMonth: Infinity,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanLimits(plan: PlanType) {
  return PLANS[plan] ?? PLANS.free;
}
