import { Lock, LogIn, User, UserPlus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { mockBusiness } from "../data/mockBusiness";
import { useLanguage } from "../i18n/useLanguage";

const emailInputClass =
  "w-full rounded-xl border-2 border-book-gold bg-black/35 px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-neutral-500 focus:border-book-gold focus:ring-1 focus:ring-book-gold/35";

const passwordInputClass =
  "w-full rounded-xl border border-book-border bg-black/35 px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-neutral-500 focus:border-book-gold focus:ring-1 focus:ring-book-gold/30";

export function SignIn() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("[demo sign-in]", { email, password: password ? "••••" : "" });
  };

  return (
    <div className="flex flex-1 flex-col justify-center pb-4 pt-2">
      <div className="rounded-2xl border border-book-border/90 bg-[#1e1e1e] px-5 py-8 shadow-xl shadow-black/40 sm:px-7">
        <header className="mb-8 text-center">
          <h1 className="font-display text-[1.35rem] font-bold uppercase leading-tight tracking-[0.06em] text-book-gold sm:text-[1.45rem]">
            {mockBusiness.brandName}
          </h1>
          <p className="mt-1 font-display text-[0.78rem] font-bold uppercase tracking-[0.28em] text-book-gold">
            {mockBusiness.brandSubtitle}
          </p>
          <p className="mt-5 text-[15px] font-normal text-white">
            {t("signInWelcomeBack")}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <User className="h-[18px] w-[18px] shrink-0 text-book-gold/95" strokeWidth={1.75} />
              {t("signInEmailLabel")}
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder={t("signInEmailPlaceholder")}
              className={emailInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[15px] text-white">
              <Lock className="h-[18px] w-[18px] shrink-0 text-book-gold/95" strokeWidth={1.75} />
              {t("signInPasswordLabel")}
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={passwordInputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-book-gold py-3.5 text-[15px] font-semibold text-black transition hover:bg-[#d4ad65] active:scale-[0.99]"
          >
            <LogIn className="h-[18px] w-[18px]" strokeWidth={2.25} />
            {t("signInSubmit")}
          </button>
        </form>

        <div className="my-8 border-t border-book-border/90" role="presentation" />

        <div className="space-y-4 text-center">
          <p className="text-[13px] text-white">{t("signInNoAccount")}</p>
          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-book-border bg-[#2a2a2a] py-3.5 text-[15px] font-medium text-white transition hover:border-white/20 hover:bg-[#323232]"
          >
            <UserPlus className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {t("signInRegisterCta")}
          </Link>
        </div>

        <p className="mt-8 text-center">
          <button
            type="button"
            className="text-[15px] font-medium text-book-gold transition hover:text-[#d4ad65] hover:underline"
            onClick={() => console.log("[demo] forgot password")}
          >
            {t("signInForgot")}
          </button>
        </p>
      </div>
    </div>
  );
}
