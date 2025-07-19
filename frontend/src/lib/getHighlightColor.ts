// LLM for the win
// [default background, highlight background]
const colors: ReadonlyArray<Readonly<[string, string]>> = [
  // Blue Family
  ['#e3f2fd', '#7dc2fa'],
  ['#f0f8ff', '#80ceff'],
  ['#e8f4fd', '#74e8b4'],
  ['#eff6ff', '#80bbff'],
  // Green Family
  ['#e8f5e8', '#73e673'],
  ['#f0fff0', '#80ff80'],
  ['#f4f8f4', '#7af57a'],
  ['#ecfdf5', '#7dfab9'],
  // Yellow/Amber Family
  ['#fffbf0', '#ffe180'],
  ['#fefce8', '#ffee80'],
  ['#fff8dc', '#f0e478'],
  ['#fffff0', '#ffff80'],
  // Pink/Rose Family
  ['#fdf2f8', '#fc7ec8'],
  ['#fff0f5', '#ff8c80'],
  ['#fef7f7', '#ff80a4'],
  ['#fdf2f2', '#fa7d7d'],
  // Purple/Lavender Family
  ['#f8f4ff', '#bd80ff'],
  ['#faf5ff', '#bd80ff'],
  ['#f9f5ff', '#9780ff'],
  // Orange/Peach Family
  ['#fff7ed', '#ffc480'],
  ['#fef5f0', '#fcb17e'],
  ['#fffaf0', '#ffca80'],
  // Cyan/Teal Family
  ['#f0fdfa', '#7dfadf'],
  ['#f0f9ff', '#80ccff'],
  ['#ecfeff', '#80f4ff'],
];

export function getHighlightColor(key: string): Readonly<[string, string]> {
  const index = djb2(key) % colors.length;
  const c = colors[index];
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
