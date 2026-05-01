import {
  CalendarDays,
  ChevronDown,
  ExternalLink,
  MapPin,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppointmentAgentChatLauncher } from "../chat/AppointmentAgentDemo";
import { mockBusiness } from "../../data/mockBusiness";
import { useLanguage } from "../../i18n/useLanguage";
import type { Locale } from "../../i18n/messages";

const langs: Locale[] = ["de", "en"];

function langFlag(code: Locale): string {
  switch (code) {
    case "de":
      return "🇩🇪";
    case "en":
      return "🇬🇧";
    
    default:
      return "";
  }
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useLanguage();
  const [locOpen, setLocOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const addressLine = `${mockBusiness.address.street}, ${mockBusiness.address.postalCode} ${mockBusiness.address.city}, ${mockBusiness.address.region}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`;

  const copyAddress = async () => {
    const text = addressLine;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const currentLangLabel =
    locale === "fa" ? t("langFa") : locale === "en" ? t("langEn") : t("langDe");
  const flagEmoji = langFlag(locale);

  const navItem = (
    key: "book" | "signin" | "social" | "location",
    href: string,
    label: string,
    icon: ReactNode,
    onClick?: () => void,
    external?: boolean,
  ) => {
    const active =
      (key === "book" &&
        (location.pathname === "/" ||
          location.pathname === "/confirm" ||
          location.pathname === "/booking/success")) ||
      (key === "signin" &&
        (location.pathname === "/signin" ||
          location.pathname === "/register")) ||
      (key === "location" && locOpen);
    const underline = active ? (
      <span className="absolute bottom-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-book-gold" />
    ) : null;
    const className = `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors ${
      active ? "text-book-gold" : "text-book-muted hover:text-neutral-200"
    }`;

    if (onClick) {
      return (
        <button type="button" key={key} onClick={onClick} className={className}>
          {icon}
          <span className="relative pb-1">
            {label}
            {underline}
          </span>
        </button>
      );
    }

    if (external) {
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {icon}
          <span>{label}</span>
        </a>
      );
    }

    return (
      <Link key={key} to={href} className={className}>
        {icon}
        <span className="relative pb-1">
          {label}
          {underline}
        </span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#121212] text-neutral-100">
      <header className="sticky top-0 z-20 border-b border-book-border/70 bg-[#121212]/95 backdrop-blur-md">
        <div className="mx-auto mt-5 max-w-lg px-4 pb-4  sm:px-5">
         

          <div className=" text-center">
            <p className="font-display text-[1.5rem] font-bold uppercase leading-tight tracking-[0.04em] text-book-gold sm:text-[1.65rem]">
              {mockBusiness.brandName}
            </p>
            <p className="mt-0.5 font-display text-[0.95rem] font-bold uppercase tracking-[0.32em] text-book-gold sm:text-base">
              {mockBusiness.brandSubtitle}
            </p>
            <p className="mt-2 text-xs font-normal text-white">
              {t("tagline")}
            </p>
          </div>
          <div className="flex mt-5 items-center justify-between gap-3">
            <Link
              to="/signin"
              className="rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs font-medium text-white transition hover:border-book-gold/35"
            >
              {t("signIn")}
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1c1c1c] px-3 py-2 text-xs font-semibold uppercase text-white"
                aria-expanded={langOpen}
              >
                <span className="text-base leading-none" aria-hidden>
                  {flagEmoji}
                </span>
                <span>{currentLangLabel}</span>
                <ChevronDown
                  className="h-3.5 w-3.5 opacity-80"
                  strokeWidth={2}
                />
              </button>
              {langOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    aria-label={t("close")}
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 min-w-[10rem] rounded-xl border border-book-border bg-[#1e1e1e] py-1 shadow-xl">
                    {langs.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setLocale(code);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ${
                          locale === code
                            ? "bg-book-gold/15 text-book-gold"
                            : "text-neutral-200 hover:bg-white/5"
                        }`}
                      >
                        <span
                          className="text-base leading-none"
                          aria-hidden
                        >
                          {langFlag(code)}
                        </span>
                        <span>
                          {code === "fa"
                            ? t("langFa")
                            : code === "en"
                              ? t("langEn")
                              : t("langDe")}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-4 sm:px-5">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-book-border bg-[#121212]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg px-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1">
          {navItem(
            "book",
            "/",
            t("navBook"),
            <CalendarDays className="h-5 w-5" strokeWidth={1.5} />,
          )}
          {navItem(
            "signin",
            "/signin",
            t("navSignIn"),
            <UserRound className="h-5 w-5" strokeWidth={1.5} />,
          )}
          {navItem(
            "social",
            mockBusiness.socialUrl,
            t("navInstagram"),
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>,
            undefined,
            true,
          )}
          {navItem(
            "location",
            "#",
            t("navLocation"),
            <MapPin className="h-5 w-5" strokeWidth={1.5} />,
            () => setLocOpen(true),
          )}
        </div>
      </nav>

      {locOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="loc-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={t("close")}
            onClick={() => setLocOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-book-border bg-book-surface p-5 shadow-2xl transition-transform">
            <h2
              id="loc-title"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-book-gold"
            >
              {t("locationTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-200">
              {addressLine}
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-book-gold py-3 text-sm font-semibold text-black transition hover:bg-[#d4ad65]"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden />
              {t("openInGoogleMaps")}
            </a>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copyAddress}
                className="flex-1 rounded-xl border border-book-gold/60 bg-transparent py-2.5 text-sm font-medium text-book-gold transition hover:bg-book-gold/10"
              >
                {copied ? t("copied") : t("copyAddress")}
              </button>
              <button
                type="button"
                onClick={() => setLocOpen(false)}
                className="rounded-xl border border-book-border px-4 py-2.5 text-sm text-book-muted transition hover:border-book-gold/40 hover:text-white"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AppointmentAgentChatLauncher />
    </div>
  );
}
