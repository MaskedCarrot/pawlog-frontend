/**
 * Parses YYYY-MM-DD as local date (avoids timezone issues with new Date("2020-05-15")).
 * Returns age in years, or null if invalid.
 */
export function getAgeYears(birthDate) {
  if (!birthDate) return null;
  const str = String(birthDate);
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const birth = new Date(y, m - 1, d);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}
