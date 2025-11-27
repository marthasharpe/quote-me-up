/**
 * Get initials from a name string
 * @param name - The full name
 * @returns The first letter of each word, up to 2 characters, uppercase
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Alice") // "A"
 * getInitials("Mary Jane Watson") // "MJ"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
