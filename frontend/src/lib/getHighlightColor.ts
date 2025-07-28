// LLM for the win
// [default background, highlight background]
const colors: ReadonlyArray<Readonly<[string, string]>> = [
  // Blue Family
  ['#e3f2fd', '#4a94e8'],  // Deeper blue
  ['#e8f4fd', '#74e8b4'],  // Turquoise
  
  // Green Family
  ['#e8f5e8', '#3cb371'],  // Medium sea green
  ['#ecfdf5', '#00c292'],  // Teal green
  
  // Yellow/Amber Family
  ['#fffbf0', '#ffd700'],  // Gold
  ['#fff8dc', '#f0e478'],  // Light yellow
  
  // Pink/Rose Family
  ['#fdf2f8', '#fc7ec8'],  // Pink
  ['#fff0f5', '#ff6b6b'],  // Coral red
  ['#fef7f7', '#ff80a4'],  // Light pink
  
  // Purple/Lavender Family
  ['#f8f4ff', '#bd80ff'],  // Light purple
  ['#f5f0ff', '#8a2be2'],  // Blue violet
  ['#f0e6ff', '#9370db'],  // Medium purple
  
  // Orange/Peach Family
  ['#fff7ed', '#ff8c00'],  // Dark orange
  ['#fffaf0', '#ffa07a'],  // Light salmon
  
  // Cyan/Teal Family
  ['#f0fdfa', '#20b2aa'],  // Light sea green
  ['#ecfeff', '#00bfff'],  // Deep sky blue
  
  // Brown/Earth Family (New)
  ['#f8f6f4', '#d2b48c'],  // Tan
  ['#f5f5dc', '#bc8f8f'],  // Rosy brown
  
  // Indigo/Navy Family (New)
  ['#f0f8ff', '#7c05cf'],  // Indigo
  ['#f5f5ff', '#6f5ed6'],  // Dark slate blue
];

export function getHighlightColor(key: string): Readonly<[string, string]> {
  const index = djb2(key) % colors.length;
  return colors[index];
}

// Claude tells me this is good, so I blindly copy and paste :p
// With some slight changes as obv JS does not use unsigned ints so overflow does not work the same way.
// Bernstein, D. J. (n.d.). Compilers and more. Retrieved July 17, 2025, from http://www.cse.yorku.ca/~oz/hash.html
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // Thank you to https://gist.github.com/eplawless/52813b1d8ad9af510d85 for correcting the LLM slop
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Force unsigned 32-bit
  return hash >>> 0;
}
