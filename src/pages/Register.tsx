import {
  ChevronDown,
  Lock,
  LogIn,
  Mail,
  Phone,
  User,
  UserPlus,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { mockBusiness } from "../data/mockBusiness";
import { dialFlagEmoji } from "../lib/dial-flags";
import { useLanguage } from "../i18n/useLanguage";

const fieldClass =
  "w-full min-w-0 rounded-[14px] border border-book-border bg-[#1e1e1e] px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-neutral-500 focus:border-book-gold focus:ring-1 focus:ring-book-gold/25";

export function Register() {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState(mockBusiness.dialCodes[0]?.dial ?? "+49");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("[demo register]", {
      firstName,
      lastName,
      email,
      dial,
      phoneLocal,
      password: password ? "••••" : "",
    });
  };

  return (
    <div className="flex flex-1 flex-col pb-8 pt-2">
      <div className="rounded-2xl border border-book-border/90 bg-[#1e1e1e] px-5 py-8 shadow-xl shadow-black/40 sm:px-7">
        <header className="mb-8 text-center">
          <h1 className="font-display text-[1.35rem] font-bold uppercase leading-tight tracking-[0.06em] text-book-gold sm:text-[1.45rem]">
            {mockBusiness.brandName}
          </h1>
          <p className="mt-1 font-display text-[0.78rem] font-bold uppercase tracking-[0.28em] text-book-gold">
            {mockBusiness.brandSubtitle}
          </p>
          <p className="mt-5 text-[15px] font-normal text-white">
            {t("registerTitle")}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <User
                className="h-[18px] w-[18px] shrink-0 text-white/90"
                strokeWidth={1.75}
              />
              {t("firstName")}
            </label>
            <input
              type="text"
              autoComplete="given-name"
              placeholder={t("registerFirstNamePlaceholder")}
              className={`${fieldClass} border-2 border-book-gold focus:border-book-gold`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <User
                className="h-[18px] w-[18px] shrink-0 text-white/90"
                strokeWidth={1.75}
              />
              {t("lastName")}
            </label>
            <input
              type="text"
              autoComplete="family-name"
              placeholder={t("registerLastNamePlaceholder")}
              className={fieldClass}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <Mail
                className="h-[18px] w-[18px] shrink-0 text-white/90"
                strokeWidth={1.75}
              />
              {t("registerEmailLabel")}
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder={t("registerEmailPlaceholder")}
              className={fieldClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <Phone
                className="h-[18px] w-[18px] shrink-0 text-white/90"
                strokeWidth={1.75}
              />
              {t("registerPhoneNumberLabel")}
            </label>
            <div className="flex gap-2">
              <div className="relative w-10 shrink-0">
                <select
                  className="h-full w-full appearance-none rounded-[12px] border-2 border-book-gold bg-[#1e1e1e] py-2 pl-0 pr-5 text-center text-[1.05rem] leading-none text-white outline-none focus:ring-1 focus:ring-book-gold/35"
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
                  className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-book-gold"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={t("registerPhonePlaceholder")}
                className={`${fieldClass} min-w-0 flex-1`}
                value={phoneLocal}
                onChange={(e) => setPhoneLocal(e.target.value)}
              />
            </div>
            <p className="mt-2 text-[12px] leading-snug text-[#888888]">
              {t("registerPhoneHint")}
            </p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <Lock
                className="h-[18px] w-[18px] shrink-0 text-white/90"
                strokeWidth={1.75}
              />
              {t("signInPasswordLabel")}
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder={t("registerPasswordPlaceholder")}
              className={fieldClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <Lock
                className="h-[18px] w-[18px] shrink-0 text-white/90"
                strokeWidth={1.75}
              />
              {t("registerPasswordConfirmLabel")}
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder={t("registerPasswordConfirmPlaceholder")}
              className={fieldClass}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-full bg-book-gold py-4 text-[15px] font-semibold text-black transition hover:bg-[#d4ad65] active:scale-[0.99]"
          >
            <UserPlus className="h-[18px] w-[18px]" strokeWidth={2.25} />
            {t("registerSubmit")}
          </button>
        </form>

        <div className="my-8 border-t border-book-border/90" role="presentation" />

        <div className="space-y-3 text-center">
          <p className="text-[13px] text-[#a3a3a3]">{t("registerHasAccount")}</p>
          <Link
            to="/signin"
            className="flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-book-border bg-[#2a2a2a] py-3.5 text-[15px] font-medium text-white transition hover:border-white/20 hover:bg-[#323232]"
          >
            <LogIn className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {t("registerSignInCta")}
          </Link>
        </div>

        <div className="mt-8 rounded-[14px] border border-book-gold/55 bg-black/30 px-4 py-3.5">
          <p className="flex gap-2.5 text-left text-[12px] leading-relaxed text-neutral-300">
            <Lock
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-book-gold"
              strokeWidth={1.75}
            />
            <span>
              <span className="font-semibold text-book-gold">
                {t("registerPrivacyBold")}{" "}
              </span>
              {t("registerPrivacyBody")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
