// Earliest four-digit year in a free-form date ("2019-2026", "June 2025 - September 2025").
export function firstYear(text: string): number | null {
  const years = text.match(/\d{4}/g);
  return years ? Math.min(...years.map(Number)) : null;
}
