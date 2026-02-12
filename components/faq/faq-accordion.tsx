"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeHelp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/data/faqs";

type FAQAccordionVariant = "full" | "preview";

interface FAQAccordionProps {
  items: FAQItem[];
  variant?: FAQAccordionVariant;
  maxItems?: number;
  defaultOpenId?: string | null;
  autoCloseOnRowLeave?: boolean;
}

export function FAQAccordion({
  items,
  variant = "full",
  maxItems,
  defaultOpenId = null,
  autoCloseOnRowLeave,
}: FAQAccordionProps) {
  const shouldAutoCloseOnRowLeave = autoCloseOnRowLeave ?? variant === "full";
  const faqItems = useMemo(
    () => (typeof maxItems === "number" ? items.slice(0, maxItems) : items),
    [items, maxItems]
  );
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const lgQuery = window.matchMedia("(min-width: 1024px)");
    const smQuery = window.matchMedia("(min-width: 640px)");

    const updateColumns = () => {
      if (lgQuery.matches) {
        setColumns(3);
      } else if (smQuery.matches) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    lgQuery.addEventListener("change", updateColumns);
    smQuery.addEventListener("change", updateColumns);

    return () => {
      lgQuery.removeEventListener("change", updateColumns);
      smQuery.removeEventListener("change", updateColumns);
    };
  }, []);

  if (variant === "full" && columns === 1) {
    return (
      <div className="space-y-4">
        {faqItems.map((faq) => {
          const isOpen = openId === faq.id;
          const Icon = faq.icon ?? BadgeHelp;
          const buttonId = `${faq.id}-button`;
          const panelId = `${faq.id}-panel`;
          return (
            <div key={faq.id} className="w-full">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={cn(
                  "w-full min-h-14 rounded-2xl border bg-white px-4 py-4 shadow-sm transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b2bd8]/40",
                  isOpen
                    ? "border-[#5b2bd8]/40 bg-[#f7f2ff] shadow-md ring-1 ring-[#5b2bd8]/20"
                    : "border-slate-200 hover:shadow-md"
                )}
              >
                <span className="w-full flex items-center gap-3">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      isOpen ? "bg-[#5b2bd8] text-white" : "bg-[#f2ecff] text-[#5b2bd8]"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-[15px] font-semibold text-slate-800 leading-snug">{faq.question}</h3>
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0 text-slate-500 transition-transform",
                      isOpen ? "rotate-180 text-[#5b2bd8]" : ""
                    )}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key={`inline-content-${faq.id}`}
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <div className="rounded-2xl border border-[#5b2bd8]/30 bg-white px-4 py-3 text-sm text-slate-600 leading-relaxed text-justify">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", variant === "preview" ? "max-w-5xl mx-auto" : "")}>
      {Array.from({ length: Math.ceil(faqItems.length / columns) }, (_, rowIndex) => {
        const start = rowIndex * columns;
        const rowFaqs = faqItems.slice(start, start + columns);
        const rowOpenId = rowFaqs.find((faq) => faq.id === openId)?.id ?? null;
        return (
          <div
            key={`row-${rowIndex}`}
            className="space-y-4"
            onMouseLeave={() => {
              if (shouldAutoCloseOnRowLeave && rowOpenId) setOpenId(null);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr items-start">
              {rowFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                const Icon = faq.icon ?? BadgeHelp;
                const buttonId = `${faq.id}-button`;
                return (
                  <div key={faq.id} className="w-full h-full">
                    <div
                      className={cn(
                        "h-full rounded-[1.35rem] p-[1px] transition-all",
                        isOpen
                          ? "bg-gradient-to-r from-[#5b2bd8]/40 via-[#9b6bff]/40 to-[#5b2bd8]/30 shadow-[0_18px_50px_-26px_rgba(91,43,216,0.6)]"
                          : "bg-transparent"
                      )}
                    >
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`${faq.id}-panel`}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className={cn(
                          "relative w-full h-full min-h-14 rounded-2xl border bg-white px-4 sm:px-5 py-4 shadow-sm transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b2bd8]/40 hover:-translate-y-0.5 hover:shadow-md",
                          isOpen
                            ? "border-transparent bg-white shadow-[0_18px_40px_-20px_rgba(91,43,216,0.6)] ring-1 ring-[#5b2bd8]/15"
                            : "border-slate-200"
                        )}
                      >
                        {isOpen ? (
                          <span className="pointer-events-none absolute -top-6 -right-8 h-24 w-24 rounded-full bg-[#b695ff]/30 blur-2xl" />
                        ) : null}
                        <span className="relative w-full h-full flex items-center gap-3">
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              isOpen ? "bg-[#5b2bd8] text-white" : "bg-[#f2ecff] text-[#5b2bd8]"
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <h3 className="text-[15px] sm:text-base font-semibold text-slate-800 leading-snug">{faq.question}</h3>
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0 text-slate-500 transition-transform",
                              isOpen ? "rotate-180 text-[#5b2bd8]" : ""
                            )}
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {rowOpenId ? (
                <motion.div
                  key={rowOpenId}
                  id={`${rowOpenId}-panel`}
                  role="region"
                  aria-labelledby={`${rowOpenId}-button`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden rounded-2xl border border-[#5b2bd8]/30 bg-white px-6 sm:px-8 py-6"
                >
                  {rowFaqs.map((faq) => {
                    if (faq.id !== rowOpenId) return null;
                    return (
                      <p key={faq.id} className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify">
                        {faq.answer}
                      </p>
                    );
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
