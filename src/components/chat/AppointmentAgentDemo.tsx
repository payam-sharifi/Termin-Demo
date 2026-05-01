import { MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { mockBusiness } from "../../data/mockBusiness";
import { useLanguage } from "../../i18n/useLanguage";
import { TypingBubbleDemo } from "./TypingBubbleDemo";

type Appointment = {
  id: string;
  providerId: string;
  dateISO: string;
  time: string;
  note: string;
};

type ChatMessage = {
  id: number;
  role: "agent" | "user";
  text: string;
};

const dateRe = /^\d{4}-\d{2}-\d{2}$/;
const timeRe = /^\d{2}:\d{2}$/;

function resolveProviderId(input: string): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  const byId = mockBusiness.providers.find((p) => p.id.toLowerCase() === normalized);
  if (byId) return byId.id;
  const byName = mockBusiness.providers.find(
    (p) => p.name.toLowerCase() === normalized,
  );
  return byName?.id ?? null;
}

function providerLabel(providerId: string): string {
  return (
    mockBusiness.providers.find((p) => p.id === providerId)?.name ?? providerId
  );
}

function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

type AppointmentAgentDemoPanelProps = {
  /** Hide the titled header row (e.g. when the modal chrome shows the title). */
  hideTitleRow?: boolean;
  /** Omit outer card framing when nested in another surface. */
  plain?: boolean;
};

/** Chat UI — use inside modal or inline. */
export function AppointmentAgentDemoPanel({
  hideTitleRow = false,
  plain = false,
}: AppointmentAgentDemoPanelProps) {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [draft, setDraft] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [seed, setSeed] = useState(1);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);

  const providerNamesHint = useMemo(
    () => mockBusiness.providers.map((p) => p.name).join(", "),
    [],
  );

  const examples = useMemo(
    () => [
      "book vansy 2026-05-12 14:30 beard trim",
      "list",
      "edit 1 time=15:00 note=move to later slot",
      "delete 1",
    ],
    [],
  );

  const pushMessage = (role: ChatMessage["role"], text: string) => {
    setChat((prev) => [...prev, { id: seed, role, text }]);
    setSeed((prev) => prev + 1);
  };

  const formatList = (items: Appointment[]): string => {
    if (!items.length) return t("chatNoAppointments");
    return items
      .map(
        (a) =>
          `#${a.id} — ${providerLabel(a.providerId)}, ${a.dateISO} ${a.time}${a.note ? `, ${t("chatListNoteLabel")}: ${a.note}` : ""}`,
      )
      .join("\n");
  };

  const handleCommand = (inputRaw: string) => {
    const input = inputRaw.trim();
    if (!input) return;
    pushMessage("user", input);

    const parts = input.split(/\s+/);
    const action = parts[0]?.toLowerCase();

    if (action === "help") {
      setHelpPanelOpen((open) => !open);
      return;
    }

    if (action === "list") {
      pushMessage("agent", formatList(appointments));
      return;
    }

    if (action === "book") {
      if (parts.length < 4) {
        pushMessage("agent", t("chatUsageBook"));
        return;
      }
      const providerId = resolveProviderId(parts[1]);
      const dateISO = parts[2];
      const time = parts[3];
      const note = parts.slice(4).join(" ");

      if (!providerId) {
        pushMessage("agent", t("chatUnknownProviderTry"));
        return;
      }
      if (!dateRe.test(dateISO)) {
        pushMessage("agent", t("chatDateFormatErr"));
        return;
      }
      if (!timeRe.test(time)) {
        pushMessage("agent", t("chatTimeFormatErr"));
        return;
      }

      const newAppointment: Appointment = {
        id: String(appointments.length + 1),
        providerId,
        dateISO,
        time,
        note,
      };
      setAppointments((prev) => [...prev, newAppointment]);
      pushMessage(
        "agent",
        fillTemplate(t("chatBooked"), {
          id: String(newAppointment.id),
          provider: providerLabel(providerId),
          date: dateISO,
          time,
        }),
      );
      return;
    }

    if (action === "delete") {
      const id = parts[1];
      if (!id) {
        pushMessage("agent", t("chatUsageDelete"));
        return;
      }
      const exists = appointments.some((a) => a.id === id);
      if (!exists) {
        pushMessage(
          "agent",
          fillTemplate(t("chatApptNotFound"), { id }),
        );
        return;
      }
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      pushMessage("agent", fillTemplate(t("chatDeleted"), { id }));
      return;
    }

    if (action === "edit") {
      const id = parts[1];
      if (!id) {
        pushMessage("agent", t("chatUsageEdit"));
        return;
      }

      const target = appointments.find((a) => a.id === id);
      if (!target) {
        pushMessage(
          "agent",
          fillTemplate(t("chatApptNotFound"), { id }),
        );
        return;
      }

      const updates = input
        .split(/\s+/)
        .slice(2)
        .reduce<Record<string, string>>((acc, token) => {
          const [k, ...rest] = token.split("=");
          if (!k || !rest.length) return acc;
          acc[k.toLowerCase()] = rest.join("=");
          return acc;
        }, {});

      const providerId = updates.provider
        ? resolveProviderId(updates.provider)
        : target.providerId;
      if (updates.provider && !providerId) {
        pushMessage("agent", t("chatUnknownProviderEdit"));
        return;
      }

      const dateISO = updates.date ?? target.dateISO;
      if (updates.date && !dateRe.test(dateISO)) {
        pushMessage("agent", t("chatDateFormatErr"));
        return;
      }

      const time = updates.time ?? target.time;
      if (updates.time && !timeRe.test(time)) {
        pushMessage("agent", t("chatTimeFormatErr"));
        return;
      }

      const note = updates.note ?? target.note;
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                providerId: providerId ?? a.providerId,
                dateISO,
                time,
                note,
              }
            : a,
        ),
      );
      pushMessage(
        "agent",
        fillTemplate(t("chatUpdated"), { id }),
      );
      return;
    }

    pushMessage(
      "agent",
      fillTemplate(t("chatUnknownCommand"), { cmd: action ?? "" }),
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setDraft("");
    handleCommand(value);
  };

  const shellClass = plain
    ? "space-y-3"
    : "space-y-3 rounded-2xl border border-book-border/85 bg-[#1a1a1a]/95 p-4 shadow-lg shadow-black/30 sm:p-5";

  return (
    <section className={shellClass}>
      {!hideTitleRow ? (
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-book-gold">
          {t("chatModalTitle")}
        </h2>
      ) : null}

      {helpPanelOpen ? (
        <div
          id="appointment-agent-help-panel"
          className="rounded-xl border border-book-gold/25 bg-black/35 px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap text-white/92"
        >
          {t("chatHelpBody")}
        </div>
      ) : null}

      <div
        className={`services-scroll min-h-[10rem] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-[#141414] p-3 ${hideTitleRow ? "max-h-[min(46dvh,22rem)]" : "max-h-56"}`}
      >
        {chat.length === 0 ? (
          <div
            role="status"
            className="space-y-4 py-3 text-xs leading-relaxed"
          >
            <TypingBubbleDemo phrases={examples} active />
            <p className="text-[13px] text-white/88">{t("chatEmptyIntro")}</p>
            <p className="text-book-muted">
              <span className="font-semibold uppercase tracking-wider text-book-gold/90">
                {t("chatEmptyProvidersLabel")}
              </span>{" "}
              <span className="text-white/80">{providerNamesHint}</span>
            </p>
            <div>
              <p className="mb-2 font-semibold uppercase tracking-[0.12em] text-book-muted">
                {t("chatQuickExamples")}
              </p>
              <p className="mb-2.5 text-[11px] text-book-muted/90">
                {t("chatEmptyExamplesHint")}
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setDraft(example)}
                    className="max-w-full break-all rounded-lg border border-book-gold/25 bg-white/5 px-2.5 py-1.5 text-left font-mono text-[11px] text-white/90 transition hover:border-book-gold/50 hover:bg-book-gold/10"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="border-t border-white/10 pt-3 text-[11px] text-book-muted">
              {t("chatEmptyHelpTip")}
            </p>
          </div>
        ) : (
          chat.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "agent"
                  ? "bg-white/5 text-white"
                  : "ml-8 bg-book-gold/20 text-white"
              }`}
            >
              {m.text}
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("chatPlaceholder")}
          aria-label={t("chatCommandInputAria")}
          className="w-full rounded-xl border border-white/15 bg-[#141414] px-3 py-2 text-sm text-white outline-none focus:border-book-gold/60 focus:ring-1 focus:ring-book-gold/30"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-book-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#d4ad65]"
        >
          {t("chatSend")}
        </button>
      </form>
    </section>
  );
}

/** @deprecated Prefer AppointmentAgentDemoPanel or AppointmentAgentChatLauncher */
export const AppointmentAgentDemo = AppointmentAgentDemoPanel;

/** Floating chat button, default-visible tooltip, opens agent in a modal */
export function AppointmentAgentChatLauncher() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  const openModal = () => {
    setModalOpen(true);
    setTooltipVisible(false);
  };

  return (
    <>
      <div className="pointer-events-none fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-40 sm:right-5">
        <div className="pointer-events-auto relative flex flex-col items-end">
          {tooltipVisible ? (
            <div
              className="mb-3 max-w-[min(18rem,calc(100vw-5rem))] rounded-xl border border-white/15 bg-[#1e1e1e] px-3.5 py-2.5 pr-10 text-xs leading-snug text-white shadow-xl"
              role="tooltip"
              id="appointment-agent-chat-tooltip"
            >
              <p>{t("chatTooltip")}</p>
              <button
                type="button"
                aria-label={t("chatDismissTooltipAria")}
                onClick={() => setTooltipVisible(false)}
                className="absolute right-2 top-2 rounded-md p-0.5 text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
              <span
                className="absolute -bottom-1.5 right-5 size-3 rotate-45 border border-r-0 border-t-0 border-white/15 bg-[#1e1e1e]"
                aria-hidden
              />
            </div>
          ) : null}
          <button
            type="button"
            aria-label={t("chatOpenAria")}
            aria-describedby={tooltipVisible ? "appointment-agent-chat-tooltip" : undefined}
            aria-expanded={modalOpen}
            aria-haspopup="dialog"
            onClick={openModal}
            className="flex size-14 items-center justify-center rounded-full border border-book-gold/55 bg-book-gold text-black shadow-[0_4px_24px_rgba(197,160,89,0.35)] transition hover:bg-[#d4ad65] hover:shadow-[0_6px_28px_rgba(197,160,89,0.45)] active:scale-[0.97]"
          >
            <MessageCircle className="size-7 shrink-0" strokeWidth={1.85} aria-hidden />
          </button>
        </div>
      </div>

      <div
        className={
          modalOpen
            ? "fixed inset-0 z-[50] flex items-end justify-center bg-black/70 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:pb-4"
            : "hidden"
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-agent-modal-title"
        aria-hidden={!modalOpen}
      >
        <button
          type="button"
          className="absolute inset-0 cursor-default"
          aria-label={t("close")}
          tabIndex={modalOpen ? 0 : -1}
          onClick={() => setModalOpen(false)}
        />
        <div className="relative z-10 flex max-h-[min(90dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-book-border bg-[#151515] shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <h2
              id="appointment-agent-modal-title"
              className="text-sm font-semibold uppercase tracking-[0.16em] text-book-gold"
            >
              {t("chatModalTitle")}
            </h2>
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setModalOpen(false)}
              className="rounded-lg p-1.5 text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <div className="services-scroll min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
            <AppointmentAgentDemoPanel hideTitleRow plain />
          </div>
        </div>
      </div>
    </>
  );
}
