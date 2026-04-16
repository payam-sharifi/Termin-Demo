import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  clearBookingSuccess,
  readBookingSuccess,
  type BookingSuccessState,
} from "../lib/booking-success";
import { useLanguage } from "../i18n/useLanguage";

export function BookingSuccess() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const fromState = location.state as BookingSuccessState | null | undefined;
  const stored = useMemo(() => readBookingSuccess(), []);

  const details: BookingSuccessState | null =
    fromState?.providerName && fromState?.dateDisplay ? fromState : stored;

  const [count, setCount] = useState(15);

  useEffect(() => {
    if (!details) return;

    const id = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          clearBookingSuccess();
          navigate("/", { replace: true });
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [details, navigate]);

  if (!details) {
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
        <div className="mb-6 text-center">
          <h1 className="font-sans text-lg font-semibold uppercase tracking-[0.12em] text-[#d6b472]">
            {t("reservedTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-book-muted">
            {t("reservedMessage")}
          </p>
        </div>

        <section className="mb-6">
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
            {t("successSummary")}
          </h2>
          <div className="rounded-xl border border-[#d6b472]/80 bg-black/25 px-4 py-4">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[11px] uppercase tracking-wide text-book-muted">
                  {t("summaryProvider")}
                </dt>
                <dd className="text-end font-medium text-white">
                  {details.providerName}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[11px] uppercase tracking-wide text-book-muted">
                  {t("summaryDate")}
                </dt>
                <dd className="text-end text-white">{details.dateDisplay}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[11px] uppercase tracking-wide text-book-muted">
                  {t("summaryTime")}
                </dt>
                <dd className="text-end text-lg font-bold leading-tight text-[#d6b472]">
                  {details.timeDisplay}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {details.extrasLines.length > 0 ? (
          <section className="mb-6">
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
              {t("successExtras")}
            </h2>
            <ul className="space-y-2 rounded-xl border border-book-border/80 bg-black/20 px-4 py-3">
              {details.extrasLines.map((line, i) => (
                <li
                  key={`${line.label}-${i}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-white">{line.label}</span>
                  <span className="shrink-0 tabular-nums text-[#d6b472]">
                    {line.price}
                  </span>
                </li>
              ))}
              <li className="flex justify-between gap-3 border-t border-white/10 pt-2 text-sm font-medium">
                <span className="text-book-muted">{t("successExtrasTotal")}</span>
                <span className="tabular-nums text-white">
                  {details.extrasTotalDisplay}
                </span>
              </li>
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
            {t("successContact")}
          </h2>
          <div className="rounded-xl border border-book-border/80 bg-black/20 px-4 py-3 text-sm">
            <dl className="space-y-2">
              <div>
                <dt className="text-[11px] uppercase text-book-muted">
                  {t("firstName")} / {t("lastName")}
                </dt>
                <dd className="text-white">
                  {details.firstName} {details.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase text-book-muted">
                  {t("email")}
                </dt>
                <dd className="break-all text-white">{details.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase text-book-muted">
                  {t("phone")}
                </dt>
                <dd className="tabular-nums text-white">
                  {details.dial} {details.phone}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <p
          className="mt-5 flex items-center justify-center gap-1 border-t border-book-border/50 pt-4 text-center text-[11px] leading-tight text-book-muted"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{t("reservedRedirect")}</span>
          <span className="tabular-nums font-semibold text-[#d6b472]">
            {count > 0 ? count : "—"}
          </span>
          <span>{t("reservedSeconds")}</span>
        </p>
      </div>
    </div>
  );
}
