/** Flag emoji per international dial prefix (demo list matches `mockBusiness.dialCodes`). */
const byDial: Record<string, string> = {
  "+49": "🇩🇪",
  "+43": "🇦🇹",
  "+41": "🇨🇭",
  "+44": "🇬🇧",
  "+33": "🇫🇷",
  "+1": "🇺🇸",
};

export function dialFlagEmoji(dial: string): string {
  return byDial[dial] ?? "🌍";
}
