// LLM for the win
// [default background, highlight background]
const colors: ReadonlyArray<Readonly<[string, string]>> = [
  // Blue Family
  ['#e3f2fd', '#bbdefb'],
  ['#f0f8ff', '#e6f3ff'],
  ['#e8f4fd', '#d1e7dd'],
  ['#eff6ff', '#dbeafe'],
  // Green Family
  ['#e8f5e8', '#c8e6c9'],
  ['#f0fff0', '#e0ffe0'],
  ['#f4f8f4', '#e8f5e8'],
  ['#ecfdf5', '#d1fae5'],
  // Yellow/Amber Family
  ['#fffbf0', '#fff3cd'],
  ['#fefce8', '#fef08a'],
  ['#fff8dc', '#f0e68c'],
  ['#fffff0', '#ffffe0'],
  // Pink/Rose Family
  ['#fdf2f8', '#fce7f3'],
  ['#fff0f5', '#ffe4e1'],
  ['#fef7f7', '#fed7e2'],
  ['#fdf2f2', '#fecaca'],
  // Purple/Lavender Family
  ['#f8f4ff', '#e9d5ff'],
  ['#faf5ff', '#f3e8ff'],
  ['#f9f5ff', '#ede9fe'],
  // Orange/Peach Family
  ['#fff7ed', '#fed7aa'],
  ['#fef5f0', '#fde4d3'],
  ['#fffaf0', '#ffecd1'],
  // Cyan/Teal Family
  ['#f0fdfa', '#ccfbf1'],
  ['#f0f9ff', '#e0f2fe'],
  ['#ecfeff', '#cffafe'],
];

export function getHighlightColor(key: string): Readonly<[string, string]> {
  const index = djb2(key) % colors.length;
  const c = colors[index];
  return colors[index];
}

// Claude tells me this is good so I blindly copy paste :p
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
