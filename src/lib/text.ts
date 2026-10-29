/**
 * Converts Unicode "math bold/italic" styled text (e.g. 𝑳𝑬𝑮𝑨𝑪𝒀, 𝐏𝐞𝐫𝐟𝐮𝐦𝐞) to plain letters,
 * strips decorative emoji, and tidies whitespace. NFKC maps those styled letters to ASCII.
 * Paragraph breaks (blank lines) are kept.
 */
export function toPlainText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .normalize('NFKC')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '') // emoji and symbols
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
