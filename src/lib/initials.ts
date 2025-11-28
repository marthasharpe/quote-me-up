/**
 * Get initials from a name string (first and last initial only)
 * @param name - The full name
 * @returns The first letter of the first and last word, uppercase
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Alice") // "A"
 * getInitials("Mary Jane Watson") // "MW"
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length === 0) return "";
  if (words.length === 1) return words[0][0].toUpperCase();

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
