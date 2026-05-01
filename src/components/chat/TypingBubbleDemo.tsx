import { useEffect, useState } from "react";

const TYPE_MS = 38;
const HOLD_MS = 2200;
const BETWEEN_MS = 400;

/** Faux “user typing” demo for empty chat transcript. */
export function TypingBubbleDemo({
  phrases,
  active,
  className = "",
}: {
  phrases: string[];
  active: boolean;
  className?: string;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active || phrases.length === 0) {
      setTyped("");
      return;
    }

    let cancelled = false;
    let timeoutId = 0;
    let phraseIndex = 0;
    let charIndex = 0;

    const schedule = (fn: () => void, ms: number) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const step = () => {
      if (cancelled) return;
      const line = phrases[phraseIndex];

      if (charIndex <= line.length) {
        setTyped(line.slice(0, charIndex));
        charIndex += 1;
        schedule(step, TYPE_MS);
        return;
      }

      schedule(() => {
        if (cancelled) return;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        setTyped("");
        schedule(step, BETWEEN_MS);
      }, HOLD_MS);
    };

    schedule(step, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [active, phrases]);

  if (!active || phrases.length === 0) return null;

  return (
    <div
      role="presentation"
      aria-hidden
      className={`pointer-events-none select-none pb-4 ${className}`}
    >
      <div className="typing-demo-soft-glow flex justify-end motion-reduce:transition-none">
        <div className="relative max-w-[min(95%,26rem)] overflow-hidden rounded-2xl border border-book-gold/35 bg-gradient-to-br from-book-gold/18 to-transparent px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="font-mono text-[12px] leading-snug text-white/93 sm:text-[13px]">
            <span className="motion-safe:tracking-tight">{typed}</span>
            <span
              className="book-typing-caret ml-0.5 inline-block h-[1.05em] w-2 translate-y-px rounded-sm bg-book-gold align-text-bottom"
              aria-hidden
            />
          </p>
          <span
            className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-book-gold/55 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
