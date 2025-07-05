/**
 * Utilities per calcoli finanziari avanzati
 * Utilizzate per simulazioni, backtesting e analisi di portfolio
 */

// Calcola il rendimento composto annualizzato (CAGR)
export const calculateCAGR = (initialValue, finalValue, years) => {
  if (initialValue <= 0 || finalValue <= 0 || years <= 0) return 0;
  return Math.pow(finalValue / initialValue, 1 / years) - 1;
};

// Calcola la volatilità (deviazione standard) da una serie di rendimenti
export const calculateVolatility = (returns) => {
  if (!returns || returns.length < 2) return 0;
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  return Math.sqrt(variance);
};

// Calcola il Sharpe Ratio
export const calculateSharpeRatio = (returns, riskFreeRate = 0.02) => {
  if (!returns || returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const volatility = calculateVolatility(returns);
  
  if (volatility === 0) return 0;
  return (avgReturn - riskFreeRate) / volatility;
};

// Calcola il Maximum Drawdown
export const calculateMaxDrawdown = (values) => {
  if (!values || values.length < 2) return 0;
  
  let maxDrawdown = 0;
  let peak = values[0];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
    } else {
      const drawdown = (peak - values[i]) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return -maxDrawdown * 100; // Ritorna come percentuale negativa
};

// Calcola il Calmar Ratio
export const calculateCalmarRatio = (annualizedReturn, maxDrawdown) => {
  if (maxDrawdown === 0) return 0;
  return annualizedReturn / Math.abs(maxDrawdown);
};

// Calcola il Sortino Ratio (simile al Sharpe ma considera solo la volatilità negativa)
export const calculateSortinoRatio = (returns, riskFreeRate = 0.02) => {
  if (!returns || returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const negativeReturns = returns.filter(r => r < riskFreeRate);
  
  if (negativeReturns.length === 0) return Infinity;
  
  const downside = Math.sqrt(
    negativeReturns.reduce((sum, r) => sum + Math.pow(r - riskFreeRate, 2), 0) / returns.length
  );
  
  return downside === 0 ? 0 : (avgReturn - riskFreeRate) / downside;
};

// Calcola Value at Risk (VaR) usando il metodo storico
export const calculateVaR = (returns, confidenceLevel = 0.95) => {
  if (!returns || returns.length === 0) return 0;
  
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  
  return sortedReturns[index] * 100; // Ritorna come percentuale
};

// Calcola Conditional Value at Risk (CVaR)
export const calculateCVaR = (returns, confidenceLevel = 0.95) => {
  if (!returns || returns.length === 0) return 0;
  
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const cutoffIndex = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  const worstReturns = sortedReturns.slice(0, cutoffIndex + 1);
  
  if (worstReturns.length === 0) return 0;
  
  const avgWorstReturn = worstReturns.reduce((sum, r) => sum + r, 0) / worstReturns.length;
  return avgWorstReturn * 100; // Ritorna come percentuale
};

// Calcola la correlazione tra due serie di dati
export const calculateCorrelation = (series1, series2) => {
  if (!series1 || !series2 || series1.length !== series2.length || series1.length < 2) return 0;
  
  const n = series1.length;
  const mean1 = series1.reduce((sum, x) => sum + x, 0) / n;
  const mean2 = series2.reduce((sum, x) => sum + x, 0) / n;
  
  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = series1[i] - mean1;
    const diff2 = series2[i] - mean2;
    
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }
  
  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator === 0 ? 0 : numerator / denominator;
};

// Calcola il Beta rispetto a un benchmark
export const calculateBeta = (portfolioReturns, benchmarkReturns) => {
  if (!portfolioReturns || !benchmarkReturns || portfolioReturns.length !== benchmarkReturns.length) return 1;
  
  const portfolioVariance = calculateVolatility(portfolioReturns) ** 2;
  const covariance = calculateCovariance(portfolioReturns, benchmarkReturns);
  const benchmarkVariance = calculateVolatility(benchmarkReturns) ** 2;
  
  return benchmarkVariance === 0 ? 1 : covariance / benchmarkVariance;
};

// Calcola la covarianza tra due serie
export const calculateCovariance = (series1, series2) => {
  if (!series1 || !series2 || series1.length !== series2.length || series1.length < 2) return 0;
  
  const n = series1.length;
  const mean1 = series1.reduce((sum, x) => sum + x, 0) / n;
  const mean2 = series2.reduce((sum, x) => sum + x, 0) / n;
  
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance += (series1[i] - mean1) * (series2[i] - mean2);
  }
  
  return covariance / (n - 1);
};

// Calcola l'Alpha (Jensen's Alpha)
export const calculateAlpha = (portfolioReturns, benchmarkReturns, riskFreeRate = 0.02) => {
  if (!portfolioReturns || !benchmarkReturns || portfolioReturns.length !== benchmarkReturns.length) return 0;
  
  const portfolioAvgReturn = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
  const benchmarkAvgReturn = benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length;
  const beta = calculateBeta(portfolioReturns, benchmarkReturns);
  
  return portfolioAvgReturn - (riskFreeRate + beta * (benchmarkAvgReturn - riskFreeRate));
};

// Calcola il tracking error
export const calculateTrackingError = (portfolioReturns, benchmarkReturns) => {
  if (!portfolioReturns || !benchmarkReturns || portfolioReturns.length !== benchmarkReturns.length) return 0;
  
  const excessReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
  return calculateVolatility(excessReturns);
};

// Calcola l'Information Ratio
export const calculateInformationRatio = (portfolioReturns, benchmarkReturns) => {
  const trackingError = calculateTrackingError(portfolioReturns, benchmarkReturns);
  if (trackingError === 0) return 0;
  
  const excessReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
  const avgExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  
  return avgExcessReturn / trackingError;
};

// Calcola il valore futuro di un investimento con contributi periodici
export const calculateFutureValue = (initialAmount, monthlyContribution, annualRate, months) => {
  const monthlyRate = annualRate / 12;
  
  // Valore futuro dell'investimento iniziale
  const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, months);
  
  // Valore futuro della serie di pagamenti
  const futureValueAnnuity = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return futureValueInitial + futureValueAnnuity;
};

// Calcola il tasso di rendimento interno (IRR) - implementazione semplificata
export const calculateIRR = (cashFlows) => {
  if (!cashFlows || cashFlows.length < 2) return 0;
  
  // Implementazione Newton-Raphson semplificata
  let rate = 0.1; // Guess iniziale del 10%
  const tolerance = 0.0001;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let npvDerivative = 0;
    
    for (let j = 0; j < cashFlows.length; j++) {
      const discountFactor = Math.pow(1 + rate, j);
      npv += cashFlows[j] / discountFactor;
      npvDerivative -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
    }
    
    if (Math.abs(npv) < tolerance) break;
    if (Math.abs(npvDerivative) < tolerance) break;
    
    rate = rate - npv / npvDerivative;
  }
  
  return rate;
};

// Simula prezzi usando il modello di Black-Scholes (movimento browniano geometrico)
export const simulateAssetPrices = (initialPrice, drift, volatility, timeSteps, numSimulations = 1) => {
  const dt = 1 / timeSteps; // Assume 1 anno diviso in timeSteps
  const simulations = [];
  
  for (let sim = 0; sim < numSimulations; sim++) {
    const prices = [initialPrice];
    
    for (let t = 1; t <= timeSteps; t++) {
      const randomShock = Math.sqrt(dt) * standardNormalRandom();
      const priceChange = drift * dt + volatility * randomShock;
      const newPrice = prices[t - 1] * Math.exp(priceChange);
      prices.push(newPrice);
    }
    
    simulations.push(prices);
  }
  
  return numSimulations === 1 ? simulations[0] : simulations;
};

// Genera numeri casuali con distribuzione normale standard
const standardNormalRandom = () => {
  // Box-Muller transform
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// Calcola la diversificazione del portfolio
export const calculateDiversificationRatio = (weights, volatilities, correlationMatrix) => {
  if (!weights || !volatilities || !correlationMatrix) return 0;
  
  // Volatilità ponderata
  const weightedVolatility = weights.reduce((sum, w, i) => sum + w * volatilities[i], 0);
  
  // Volatilità del portfolio
  let portfolioVariance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      portfolioVariance += weights[i] * weights[j] * volatilities[i] * volatilities[j] * correlationMatrix[i][j];
    }
  }
  
  const portfolioVolatility = Math.sqrt(portfolioVariance);
  
  return portfolioVolatility === 0 ? 0 : weightedVolatility / portfolioVolatility;
};

// Calcola il rebalancing ottimale
export const calculateRebalancing = (currentWeights, targetWeights, portfolioValue, minTradeSize = 100) => {
  const trades = [];
  let totalTrades = 0;
  
  for (let i = 0; i < currentWeights.length; i++) {
    const currentValue = currentWeights[i] * portfolioValue;
    const targetValue = targetWeights[i] * portfolioValue;
    const tradeValue = targetValue - currentValue;
    
    if (Math.abs(tradeValue) >= minTradeSize) {
      trades.push({
        asset: i,
        currentWeight: currentWeights[i],
        targetWeight: targetWeights[i],
        tradeValue: tradeValue,
        direction: tradeValue > 0 ? 'BUY' : 'SELL'
      });
      totalTrades += Math.abs(tradeValue);
    }
  }
  
  return {
    trades,
    totalTradeValue: totalTrades,
    tradingCost: totalTrades * 0.001 // Assume 0.1% trading cost
  };
};

// Calcola metriche di performance per periodo
export const calculatePeriodMetrics = (values, period = 'monthly') => {
  if (!values || values.length < 2) return {};
  
  const returns = [];
  for (let i = 1; i < values.length; i++) {
    returns.push((values[i] - values[i - 1]) / values[i - 1]);
  }
  
  const metrics = {
    totalReturn: (values[values.length - 1] - values[0]) / values[0],
    volatility: calculateVolatility(returns),
    sharpeRatio: calculateSharpeRatio(returns),
    maxDrawdown: calculateMaxDrawdown(values),
    winRate: returns.filter(r => r > 0).length / returns.length,
    avgPositiveReturn: returns.filter(r => r > 0).reduce((sum, r) => sum + r, 0) / returns.filter(r => r > 0).length || 0,
    avgNegativeReturn: returns.filter(r => r < 0).reduce((sum, r) => sum + r, 0) / returns.filter(r => r < 0).length || 0,
    bestPeriod: Math.max(...returns),
    worstPeriod: Math.min(...returns),
    var95: calculateVaR(returns, 0.95),
    cvar95: calculateCVaR(returns, 0.95)
  };
  
  return metrics;
};