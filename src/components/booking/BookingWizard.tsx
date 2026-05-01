import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDateAvailability,
  isTimeSlotDisabled,
  mockBusiness,
  type MockProvider,
} from "../../data/mockBusiness";
import { useLanguage } from "../../i18n/useLanguage";
import {
  clearBookingDraft,
  parseISODateLocal,
  readBookingDraft,
  saveBookingDraft,
} from "../../lib/booking-draft";
import { getMonthGrid, toISODate } from "../../lib/date";

function localeForIntl(code: string): string {
  if (code === "fa") return "fa-IR";
  if (code === "de") return "de-DE";
  return "en-GB";
}

/** Bottom sheet: compact HH:mm (no “Uhr”), like reference UI */
function formatTimeInSheet(slot: string): string {
  return slot;
}

function formatTimeSheetSubtitle(
  d: Date,
  locale: string,
  intlLocale: string,
): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const datePart = `${day}.${month}.${year}`;

  if (locale === "fa") {
    return new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  }

  const weekday = new Intl.DateTimeFormat(
    locale === "de" ? "de-DE" : intlLocale,
    { weekday: "long" },
  )
    .format(d)
    .toUpperCase();

  return `${weekday}, ${datePart}`;
}

function readDraftProvider(): MockProvider | null {
  const draft = readBookingDraft();
  if (!draft) return null;
  return mockBusiness.providers.find((p) => p.id === draft.providerId) ?? null;
}

function readDraftDate(): Date | null {
  const draft = readBookingDraft();
  if (!draft) return null;
  return parseISODateLocal(draft.dateISO);
}

export function BookingWizard() {
  const { locale, t } = useLanguage();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<MockProvider | null>(
    readDraftProvider,
  );
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = readDraftDate();
    if (d) return { y: d.getFullYear(), m: d.getMonth() };
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(readDraftDate);
  const [timeSheetOpen, setTimeSheetOpen] = useState(false);

  const intlLocale = localeForIntl(locale);

  const monthLabel = useMemo(() => {
    const d = new Date(monthCursor.y, monthCursor.m, 1);
    return new Intl.DateTimeFormat(intlLocale, {
      month: "long",
      year: "numeric",
    }).format(d);
  }, [monthCursor.m, monthCursor.y, intlLocale]);

  const weekdayLabels = useMemo(() => {
    if (locale === "de") {
      return ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
    }
    const base = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return new Intl.DateTimeFormat(intlLocale, { weekday: "short" }).format(
        d,
      );
    });
  }, [intlLocale, locale]);

  const grid = useMemo(
    () => getMonthGrid(monthCursor.y, monthCursor.m),
    [monthCursor.m, monthCursor.y],
  );

  const timeSheetDateLine = useMemo(() => {
    if (!selectedDate) return "";
    return formatTimeSheetSubtitle(selectedDate, locale, intlLocale);
  }, [selectedDate, locale, intlLocale]);

  const selectProvider = (id: string) => {
    const p = mockBusiness.providers.find((x) => x.id === id);
    if (!p) return;
    setProvider(p);
    setSelectedDate(null);
    setTimeSheetOpen(false);
    clearBookingDraft();
  };

  useEffect(() => {
    if (!timeSheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [timeSheetOpen]);

  const timeCardBase =
    "rounded-2xl border border-book-border/85 bg-[#1a1a1a]/95 px-5 py-6 shadow-lg shadow-black/30 sm:px-6";

  return (
    <div className="flex flex-col gap-4">
      {/* Step 1 — who provides the service */}
      <div className={timeCardBase}>
        <div className="space-y-5">
          <h2 className="text-center font-sans text-[11px] font-semibold leading-snug tracking-[0.22em] text-book-gold">
            {t("step1BarberTitle")}
          </h2>
          <p className="text-center text-[10px] font-normal leading-snug tracking-[0.2em] text-white">
            {t("step1BarberHint")}
          </p>

          <div className="relative">
            <select
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/15 bg-[#141414] py-3.5 pl-4 pr-12 text-sm text-white outline-none transition hover:border-white/25 focus:border-book-gold/60 focus:ring-1 focus:ring-book-gold/30"
              value={provider?.id ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                selectProvider(v);
              }}
              aria-label={t("step1BarberHint")}
            >
              <option value="" disabled>
                {t("providerPlaceholder")}
              </option>
              {mockBusiness.providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/90"
              strokeWidth={2}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Step 2 — calendar (after provider chosen) */}
      {provider ? (
        <div className={timeCardBase}>
          <h3 className="mb-4 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-book-gold">
            {t("step2DateTitle")}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-book-border text-book-muted transition-colors hover:border-book-gold/40 hover:text-white"
                onClick={() =>
                  setMonthCursor(({ y, m }) => {
                    const d = new Date(y, m - 1, 1);
                    return { y: d.getFullYear(), m: d.getMonth() };
                  })
                }
                aria-label={t("prevMonth")}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <p className="text-sm font-medium capitalize text-white">
                {monthLabel}
              </p>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-book-border text-book-muted transition-colors hover:border-book-gold/40 hover:text-white"
                onClick={() =>
                  setMonthCursor(({ y, m }) => {
                    const d = new Date(y, m + 1, 1);
                    return { y: d.getFullYear(), m: d.getMonth() };
                  })
                }
                aria-label={t("nextMonth")}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-medium uppercase tracking-wider text-book-muted">
              {weekdayLabels.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {grid.map((cell, i) => {
                if (!cell) return <div key={`pad-${i}`} />;
                const iso = toISODate(cell);
                const status = getDateAvailability(iso);
                const isSel = selectedDate && toISODate(selectedDate) === iso;
                const clickable =
                  status === "available" || status === "partial";
                const borderClass =
                  status === "available"
                    ? "border-book-slot-green"
                    : status === "partial"
                      ? "border-book-slot-brown"
                      : status === "full"
                        ? "border-book-slot-red"
                        : "border-white/10";

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!clickable}
                    onClick={() => {
                      setSelectedDate(cell);
                      setTimeSheetOpen(true);
                    }}
                    className={`flex aspect-square max-h-11 items-center justify-center rounded-xl border-2 text-sm transition ${
                      !clickable
                        ? "cursor-not-allowed border-book-border/40 bg-black/25 text-book-muted/40"
                        : isSel
                          ? "border-book-gold bg-book-gold font-semibold text-black"
                          : `border bg-[#141414] text-white ${borderClass} hover:brightness-110`
                    }`}
                  >
                    {cell.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-2 border-t border-book-border/50 pt-3 text-[10px] text-book-muted">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm bg-book-slot-green"
                    aria-hidden
                  />
                  {t("legendAvailable")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm bg-book-slot-brown"
                    aria-hidden
                  />
                  {t("legendPartial")}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm bg-book-slot-red"
                  aria-hidden
                />
                {t("legendFull")}
              </span>
            </div>

            {selectedDate && !timeSheetOpen ? (
              <button
                type="button"
                onClick={() => setTimeSheetOpen(true)}
                className="mt-4 w-full rounded-xl border border-book-gold/45 bg-transparent py-3 text-xs font-semibold uppercase tracking-[0.12em] text-book-gold transition hover:bg-book-gold/10"
              >
                {t("stepTimeTitle")}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Time picker — bottom sheet */}
      {timeSheetOpen && provider && selectedDate ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="time-sheet-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
            aria-label={t("close")}
            onClick={() => setTimeSheetOpen(false)}
          />

          <div className="animate-book-sheet relative z-10 mx-auto flex w-full max-w-lg max-h-[88vh] flex-col rounded-t-2xl border border-b-0 border-white/10 bg-[#1a1a1a] shadow-[0_-8px_32px_rgba(0,0,0,0.45)]">
            <div
              className="mx-auto mt-3 h-1 w-11 shrink-0 rounded-full bg-white/25"
              aria-hidden
            />

            <div className="flex items-start justify-between gap-3 border-b border-white/8 px-5 pb-4 pt-1">
              <div className="min-w-0 flex-1 pr-2">
                <h3
                  id="time-sheet-title"
                  className="font-sans text-[12px] font-bold uppercase leading-tight tracking-[0.14em] text-[#c5a059]"
                >
                  {t("timeSheetHeading")}
                </h3>
                <p className="mt-1.5 text-[11px] font-medium uppercase leading-snug tracking-[0.08em] text-white">
                  {timeSheetDateLine}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTimeSheetOpen(false)}
                className="shrink-0 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {mockBusiness.timeSlots.map((slot) => {
                  const disabled = isTimeSlotDisabled(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (disabled || !provider || !selectedDate) return;
                        const payload = {
                          providerId: provider.id,
                          dateISO: toISODate(selectedDate),
                          time: slot,
                        };
                        saveBookingDraft(payload);
                        setTimeSheetOpen(false);
                        navigate("/confirm", { state: payload });
                      }}
                      className={`rounded-lg border py-3 text-center text-sm font-medium tabular-nums transition ${
                        disabled
                          ? "cursor-not-allowed border-white/5 bg-[#121212]/90 text-white/22"
                          : "border-white/12 bg-[#151515] text-white hover:border-[#c5a059]/45 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      {formatTimeInSheet(slot)}
                    </button>
                  );
                })}
              </div>
              {!mockBusiness.timeSlots.length ? (
                <p className="mt-3 text-center text-sm text-book-muted">
                  {t("noSlots")}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
