export const calculateSchemeA = (initialInvestment, dailyMilkSold, milkPrice) => {
  // initialInvestment is to buy a cow.
  // Running returns:
  const totalDailyRevenue = dailyMilkSold * milkPrice;
  const expenses = totalDailyRevenue * 0.5;
  const profit = totalDailyRevenue * 0.5;
  const investorProfitDaily = profit * 0.20;
  const farmProfitDaily = profit * 0.80;

  const investorProfitMonthly = investorProfitDaily * 30;

  // Final return after 5 years (1 main cow + 2 calves)
  const mainCowFinalValue = initialInvestment * 0.50;
  const calvesFinalValue = (initialInvestment * 2) * 0.75;
  const totalFinalReturn = mainCowFinalValue + calvesFinalValue;

  return {
    investorProfitMonthly,
    farmProfitMonthly: farmProfitDaily * 30,
    totalFinalReturn
  };
};

export const calculateRiskRefund = (initialInvestment, activeYears) => {
  if (activeYears <= 1) return initialInvestment * 1.0;
  if (activeYears <= 2) return initialInvestment * 0.9;
  if (activeYears <= 3) return initialInvestment * 0.8;
  return 0;
};

