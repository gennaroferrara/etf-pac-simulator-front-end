/**
 * Utilities per la formattazione di dati finanziari e numerici
 * Utilizzate per display consistente in tutta l'applicazione
 */

// Formatta valute in Euro
export const formatCurrency = (value, options = {}) => {
  const {
    currency = 'EUR',
    locale = 'it-IT',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '€0';
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    ...(compact && { notation: 'compact', compactDisplay: 'short' })
  });

  return formatter.format(value);
};

// Formatta percentuali
export const formatPercentage = (value, options = {}) => {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = true,
    multiplier = 1
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }

  const adjustedValue = value * multiplier;
  const sign = showSign && adjustedValue >= 0 ? '+' : '';
  
  return `${sign}${adjustedValue.toFixed(maximumFractionDigits)}%`;
};

// Formatta numeri con separatori delle migliaia
export const formatNumber = (value, options = {}) => {
  const {
    locale = 'it-IT',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    ...(compact && { notation: 'compact', compactDisplay: 'short' })
  });

  return formatter.format(value);
};

// Formatta date
export const formatDate = (date, options = {}) => {
  const {
    locale = 'it-IT',
    dateStyle = 'medium',
    timeStyle = undefined
  } = options;

  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Data non valida';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle
  }).format(dateObj);
};

// Formatta date relative (es. "2 giorni fa")
export const formatRelativeDate = (date, locale = 'it-IT') => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Data non valida';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  
  const units = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'week', ms: 604800000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 }
  ];

  for (const { unit, ms } of units) {
    const diff = Math.round(diffInMs / ms);
    if (Math.abs(diff) >= 1) {
      return rtf.format(diff, unit);
    }
  }

  return rtf.format(0, 'second');
};

// Formatta durata in formato leggibile
export const formatDuration = (months, options = {}) => {
  const { showMonths = true, abbreviated = false } = options;

  if (!months || months < 0) return '0 mesi';

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (abbreviated) {
    if (years > 0 && remainingMonths > 0) {
      return `${years}a ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years}a`;
    } else {
      return `${remainingMonths}m`;
    }
  }

  if (years > 0 && remainingMonths > 0) {
    return `${years} ${years === 1 ? 'anno' : 'anni'} e ${remainingMonths} ${remainingMonths === 1 ? 'mese' : 'mesi'}`;
  } else if (years > 0) {
    return `${years} ${years === 1 ? 'anno' : 'anni'}`;
  } else if (showMonths) {
    return `${remainingMonths} ${remainingMonths === 1 ? 'mese' : 'mesi'}`;
  }

  return '';
};

// Formatta valori grandi con suffissi (K, M, B)
export const formatLargeNumber = (value, options = {}) => {
  const { precision = 1, currency = false } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return currency ? '€0' : '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const currencySymbol = currency ? '€' : '';

  if (absValue >= 1e9) {
    return `${sign}${currencySymbol}${(absValue / 1e9).toFixed(precision)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${currencySymbol}${(absValue / 1e6).toFixed(precision)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${currencySymbol}${(absValue / 1e3).toFixed(precision)}K`;
  } else {
    return `${sign}${currencySymbol}${absValue.toFixed(precision)}`;
  }
};

// Formatta ratio e metriche finanziarie
export const formatRatio = (value, options = {}) => {
  const { precision = 2, showSign = false } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }

  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(precision)}`;
};

// Formatta range di valori
export const formatRange = (min, max, formatter = formatCurrency) => {
  if (min === max) {
    return formatter(min);
  }
  return `${formatter(min)} - ${formatter(max)}`;
};

// Formatta indirizzi e allocazioni
export const formatAllocation = (allocations, options = {}) => {
  const { showPercentage = true, precision = 1, separator = ', ' } = options;

  if (!allocations || typeof allocations !== 'object') {
    return '';
  }

  const entries = Object.entries(allocations)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => {
      const label = key.replace('_', ' ').toUpperCase();
      return showPercentage ? `${label}: ${value.toFixed(precision)}%` : `${label}: ${value}`;
    });

  return entries.join(separator);
};

// Formatta indirizzi email e nomi utente
export const formatUserName = (name, options = {}) => {
  const { capitalize = true, maxLength = 50 } = options;

  if (!name || typeof name !== 'string') {
    return 'Utente';
  }

  let formatted = name.trim();
  
  if (capitalize) {
    formatted = formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  if (formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength - 3) + '...';
  }

  return formatted;
};

// Formatta codici ETF e ticker
export const formatTicker = (ticker, options = {}) => {
  const { uppercase = true, maxLength = 10 } = options;

  if (!ticker || typeof ticker !== 'string') {
    return '';
  }

  let formatted = ticker.trim();
  
  if (uppercase) {
    formatted = formatted.toUpperCase();
  }

  if (formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength);
  }

  return formatted;
};

// Formatta descrizioni e testi lunghi
export const formatDescription = (text, options = {}) => {
  const { maxLength = 100, addEllipsis = true } = options;

  if (!text || typeof text !== 'string') {
    return '';
  }

  const trimmed = text.trim();
  
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  if (addEllipsis) {
    return trimmed.substring(0, maxLength - 3) + '...';
  }

  return trimmed.substring(0, maxLength);
};

// Formatta stati e badge
export const formatStatus = (status, options = {}) => {
  const { capitalize = true } = options;

  if (!status || typeof status !== 'string') {
    return 'N/A';
  }

  let formatted = status.replace('_', ' ');
  
  if (capitalize) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  }

  return formatted;
};

// Formatta metriche di performance
export const formatMetric = (value, type, options = {}) => {
  switch (type) {
    case 'currency':
      return formatCurrency(value, options);
    case 'percentage':
      return formatPercentage(value, options);
    case 'ratio':
      return formatRatio(value, options);
    case 'number':
      return formatNumber(value, options);
    case 'duration':
      return formatDuration(value, options);
    case 'large-number':
      return formatLargeNumber(value, options);
    default:
      return String(value);
  }
};

// Utility per determinare il colore basato sul valore
export const getColorForValue = (value, thresholds = {}) => {
  const {
    positive = 'text-green-600',
    negative = 'text-red-600',
    neutral = 'text-gray-600',
    warning = 'text-yellow-600'
  } = thresholds;

  if (value > 0) return positive;
  if (value < 0) return negative;
  return neutral;
};

// Utility per formattare arrays di dati per grafici
export const formatChartData = (data, xKey, yKey, options = {}) => {
  const { formatX = (x) => x, formatY = (y) => y } = options;

  if (!Array.isArray(data)) return [];

  return data.map(item => ({
    ...item,
    [xKey]: formatX(item[xKey]),
    [yKey]: formatY(item[yKey])
  }));
};

// Utility per validare e sanitizzare input numerici
export const sanitizeNumericInput = (value, options = {}) => {
  const { min = -Infinity, max = Infinity, defaultValue = 0 } = options;

  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return defaultValue;
  }

  return Math.max(min, Math.min(max, numValue));
};

// Utility per calcolare variazioni percentuali
export const calculateChange = (currentValue, previousValue, options = {}) => {
  const { absolute = false, format = true } = options;

  if (!previousValue || previousValue === 0) {
    return format ? 'N/A' : null;
  }

  const change = currentValue - previousValue;
  const percentChange = (change / Math.abs(previousValue)) * 100;

  if (absolute) {
    return format ? formatCurrency(Math.abs(change)) : Math.abs(change);
  }

  return format ? formatPercentage(percentChange) : percentChange;
};

// Utility per formattare tooltip nei grafici
export const formatTooltip = (value, name, props, type = 'currency') => {
  const formattedValue = formatMetric(value, type);
  const formattedName = name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return [formattedValue, formattedName];
};

// Utility per determinare l'icona basata sul trend
export const getTrendIcon = (currentValue, previousValue) => {
  if (!previousValue) return '➡️';
  
  if (currentValue > previousValue) return '📈';
  if (currentValue < previousValue) return '📉';
  return '➡️';
};

// Export di tutte le utility come oggetto per import semplificato
export const formatters = {
  currency: formatCurrency,
  percentage: formatPercentage,
  number: formatNumber,
  date: formatDate,
  relativeDate: formatRelativeDate,
  duration: formatDuration,
  largeNumber: formatLargeNumber,
  ratio: formatRatio,
  range: formatRange,
  allocation: formatAllocation,
  userName: formatUserName,
  ticker: formatTicker,
  description: formatDescription,
  status: formatStatus,
  metric: formatMetric,
  getColorForValue,
  formatChartData,
  sanitizeNumericInput,
  calculateChange,
  formatTooltip,
  getTrendIcon
};