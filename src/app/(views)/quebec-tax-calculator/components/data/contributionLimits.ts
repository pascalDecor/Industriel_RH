// RRSP contribution limits are 18% of previous year's earned income up to a maximum
export const RRSP_PERCENTAGE_LIMIT = 0.18;
export const RRSP_DOLLAR_LIMITS: Record<string, number> = {
  '2024': 31560,
  '2023': 30780,
  '2022': 29210,
  '2021': 27830
};

// TFSA contribution limits by year
export const TFSA_LIMITS: Record<string, number> = {
  '2024': 7000,
  '2023': 6500,
  '2022': 6000,
  '2021': 6000
};