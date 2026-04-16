import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

export function Legal() {
  const { t } = useLanguage()

  return (
    <article className="flex flex-1 flex-col gap-8 pb-8">
      <header className="space-y-2 text-center sm:text-start">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-book-gold">
          {t('legalPageTitle')}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {t('termsHeading')}
        </h1>
      </header>

      <section className="space-y-3 rounded-2xl border border-book-border bg-book-surface/80 p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-300">
          {t('termsHeading')}
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">{t('termsP1')}</p>
        <p className="text-sm leading-relaxed text-neutral-300">{t('termsP2')}</p>
      </section>

      <section className="space-y-3 rounded-2xl border border-book-border bg-book-surface/80 p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-300">
          {t('privacyHeading')}
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">{t('privacyP1')}</p>
        <p className="text-sm leading-relaxed text-neutral-300">{t('privacyP2')}</p>
      </section>

      <section className="space-y-3 rounded-2xl border border-book-border bg-book-surface/80 p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-300">
          {t('disclaimerHeading')}
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">{t('disclaimerP1')}</p>
        <p className="text-sm leading-relaxed text-neutral-300">{t('disclaimerP2')}</p>
      </section>

      <Link
        to="/"
        className="inline-flex items-center justify-center self-center rounded-xl border border-book-gold/50 px-5 py-2.5 text-sm font-medium text-book-gold transition hover:bg-book-gold/10 sm:self-start"
      >
        {t('backHome')}
      </Link>
    </article>
  )
}
