import { Check, ChevronDown, ChevronLeft, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { mockBusiness } from "../data/mockBusiness";
import {
  clearBookingDraft,
  parseISODateLocal,
  readBookingDraft,
  type BookingDraft,
} from "../lib/booking-draft";
import {
  saveBookingSuccess,
  type BookingSuccessState,
} from "../lib/booking-success";
import { dialFlagEmoji } from "../lib/dial-flags";
import { useLanguage } from "../i18n/useLanguage";

function formatTimeLabel(slot: string, locale: string): string {
  if (locale === "de") return `${slot} Uhr`;
  return slot;
}

function formatPriceEUR(amount: number, locale: string): string {
  const loc =
    locale === "fa" ? "fa-IR" : locale === "de" ? "de-DE" : "en-GB";
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function BookingConfirm() {
  const { locale, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const draft = useMemo((): BookingDraft | null => {
    const s = location.state as BookingDraft | null | undefined;
    if (s?.providerId && s?.dateISO && s?.time) return s;
    return readBookingDraft();
  }, [location.state]);

  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [dial, setDial] = useState(mockBusiness.dialCodes[0]?.dial ?? "+49");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const provider = useMemo(() => {
    if (!draft) return null;
    return mockBusiness.providers.find((p) => p.id === draft.providerId) ?? null;
  }, [draft]);

  const selectedDate = useMemo(() => {
    if (!draft) return null;
    return parseISODateLocal(draft.dateISO);
  }, [draft]);

  const summaryDateShort = useMemo(() => {
    if (!selectedDate) return "";
    if (locale === "fa")
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(selectedDate);
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const y = selectedDate.getFullYear();
    return `${d}.${m}.${y}`;
  }, [selectedDate, locale]);

  const extrasTotal = mockBusiness.lineItems
    .filter((item) => extras[item.id])
    .reduce((sum, item) => sum + item.price, 0);

  const toggleExtra = (id: string) => {
    setExtras((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft || !provider) return;

    const selectedLineItems = mockBusiness.lineItems.filter(
      (item) => extras[item.id],
    );

    const extrasLines = selectedLineItems.map((item) => ({
      label: t(item.labelKey),
      price: formatPriceEUR(item.price, locale),
    }));

    const extrasTotalDisplay = formatPriceEUR(
      extrasTotal,
      locale,
    );

    const successState: BookingSuccessState = {
      providerName: provider.name,
      dateDisplay: summaryDateShort,
      timeDisplay: formatTimeLabel(draft.time, locale),
      dial,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      extrasLines,
      extrasTotalDisplay,
    };

    const payload = {
      provider,
      dateISO: draft.dateISO,
      time: draft.time,
      dial,
      ...form,
      extras: selectedLineItems,
      extrasTotal,
      currency: mockBusiness.lineItems[0]?.currency ?? "EUR",
    };

    console.log("[demo booking]", payload);
    saveBookingSuccess(successState);
    clearBookingDraft();
    navigate("/booking/success", { state: successState });
  };

  if (!draft || !provider || !selectedDate) {
    return <Navigate to="/" replace />;
  }

  const cardClass =
    "rounded-2xl border border-book-border/85 bg-[#1a1a1a]/95 px-5 py-6 shadow-lg shadow-black/30 sm:px-6";

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/"
        className="-mb-1 inline-flex items-center gap-1.5 text-sm text-book-muted transition hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        {t("backHome")}
      </Link>

      <div className={cardClass}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-center font-sans text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] text-[#d6b472] sm:text-left">
              {t("stepConfirm")}
            </h3>
            <Link
              to="/"
              className="rounded-lg p-1 text-white hover:bg-white/10"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="rounded-xl border border-[#d6b472]/80 bg-black/25 px-4 py-4">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[11px] uppercase tracking-wide text-book-muted">
                  {t("summaryProvider")}
                </dt>
                <dd className="text-end font-medium text-white">
                  {provider.name}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[11px] uppercase tracking-wide text-book-muted">
                  {t("summaryDate")}
                </dt>
                <dd className="text-end text-white">{summaryDateShort}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[11px] uppercase tracking-wide text-book-muted">
                  {t("summaryTime")}
                </dt>
                <dd className="text-end text-lg font-bold leading-tight text-[#d6b472]">
                  {formatTimeLabel(draft.time, locale)}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-white/90">
              {t("optionalTitle")}
            </p>
            <div className="services-scroll max-h-[14.25rem] space-y-2 overflow-y-auto overflow-x-hidden pr-1 sm:max-h-[15rem]">
              {mockBusiness.lineItems.map((item) => {
                const selected = !!extras[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleExtra(item.id)}
                    className={`flex w-full gap-3 rounded-2xl border px-3.5 py-3 text-start transition ${
                      selected
                        ? "border-[#d6b472] bg-[#141414]/90"
                        : "border-book-border/90 bg-transparent hover:border-white/15"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition ${
                        selected
                          ? "border-[#c5a059] bg-[#c5a059]"
                          : "border-white/30 bg-transparent"
                      }`}
                      aria-hidden
                    >
                      {selected ? (
                        <Check
                          className="h-3.5 w-3.5 stroke-[3] text-white"
                          strokeWidth={3}
                        />
                      ) : null}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-sm font-medium leading-tight text-white">
                        {t(item.labelKey)}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-[#d6b472]">
                        {formatPriceEUR(item.price, locale)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {extrasTotal > 0 ? (
              <p className="mt-3 text-end text-sm text-book-muted">
                +
                {formatPriceEUR(
                  extrasTotal,
                  locale,
                )}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-book-muted">
                {t("firstName")}
              </span>
              <input
                required
                className="w-full rounded-xl border border-book-border bg-black/30 px-3 py-2.5 text-white outline-none ring-0 transition focus:border-book-gold"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-book-muted">
                {t("lastName")}
              </span>
              <input
                required
                className="w-full rounded-xl border border-book-border bg-black/30 px-3 py-2.5 text-white outline-none transition focus:border-book-gold"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-book-muted">{t("email")}</span>
              <input
                required
                type="email"
                className="w-full rounded-xl border border-book-border bg-black/30 px-3 py-2.5 text-white outline-none transition focus:border-book-gold"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-book-muted">{t("phone")}</span>
              <div className="flex gap-2">
                <div className="relative w-10 shrink-0">
                  <select
                    className="h-full w-full appearance-none rounded-xl border border-book-border bg-black/30 py-2 pl-0 pr-5 text-center text-[1.05rem] leading-none text-white outline-none transition focus:border-book-gold"
                    value={dial}
                    onChange={(e) => setDial(e.target.value)}
                    aria-label={t("countryCode")}
                  >
                    {mockBusiness.dialCodes.map((d) => (
                      <option key={d.dial} value={d.dial}>
                        {dialFlagEmoji(d.dial)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-book-gold/90"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </div>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  className="min-w-0 flex-1 rounded-xl border border-book-border bg-black/30 px-3 py-2.5 text-white outline-none transition focus:border-book-gold"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-book-gold py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#d4ad65]"
          >
            {t("bookCta")}
          </button>
        </form>
      </div>
    </div>
  );
}
