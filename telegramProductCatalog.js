export const TELEGRAM_DISCOUNT = 0.05;
export const STARS_FRAGMENT_PRICE_PER_STAR = 0.015;

export const telegramPremiumPlans = [
  { id: '3m', name: '3 месяца', months: 3, fragmentPrice: 11.99 },
  { id: '6m', name: '6 месяцев', months: 6, fragmentPrice: 15.99 },
  { id: '12m', name: '12 месяцев', months: 12, fragmentPrice: 28.99 },
];

export const telegramStarsPackages = [
  50,
  100,
  250,
  500,
  750,
  1000,
  1500,
  2500,
  5000,
  10000,
  25000,
  50000,
  100000,
  250000,
  500000,
  1000000,
  2500000,
  5000000,
].map((amount) => ({
  id: String(amount),
  amount,
  fragmentPrice: amount * STARS_FRAGMENT_PRICE_PER_STAR,
}));

export function getTelegramKronPrice(fragmentPrice) {
  return Math.round((Number(fragmentPrice) * (1 - TELEGRAM_DISCOUNT) + Number.EPSILON) * 100) / 100;
}

export function findTelegramPremiumPlan(planId) {
  return telegramPremiumPlans.find((plan) => plan.id === planId) || null;
}

export function findTelegramStarsPackage(amount) {
  return telegramStarsPackages.find((item) => item.amount === Number(amount)) || null;
}
