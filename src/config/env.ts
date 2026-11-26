/**
 * Application environment configuration
 * Sourced safely from Vite's import.meta.env
 */

const configuredAppTitle = (import.meta.env.VITE_APP_TITLE || 'Qurbani Haat').replace(/^["']|["']$/g, '').trim();
export const APP_TITLE: string = configuredAppTitle === 'QurbaniHaat' ? 'Qurbani Haat' : configuredAppTitle;
export const MARKETPLACE_CURRENCY: string = (import.meta.env.VITE_MARKETPLACE_CURRENCY || 'BDT').replace(/^["']|["']$/g, '').trim();

/**
 * Format any product price, checkout amount, order total, or invoice amount
 * using the configured marketplace currency.
 */
export function formatCurrency(amount: number): string {
  const currencyCode = (import.meta.env.VITE_MARKETPLACE_CURRENCY || MARKETPLACE_CURRENCY || 'BDT').trim();

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currencyCode} ${Number(amount || 0).toLocaleString()}`;
  }
}
