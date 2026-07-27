"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import TelegramIcon from "@/assets/icons/TelegramIcon";
import VkIcon from "@/assets/icons/VkIcon";
import LinkArrowIcon from "@/assets/icons/LinkArrowIcon";
import Card from "@/components/ui/Card";

gsap.registerPlugin(ScrollTrigger);

/* Messenger bots data */
const MESSENGER_BOTS = [
  {
    id: "vk",
    name: "VKontakte",
    handle: "Chats Forwarder",
    url: "https://vk.com/club239265109",
    Icon: VkIcon,
    bgClass: "fill-cerulean-600",
  },
  {
    id: "tg",
    name: "Telegram",
    handle: "@chatsForwarderbot",
    url: "https://t.me/chatsForwarderbot",
    Icon: TelegramIcon,
    bgClass: "fill-cerulean-500",
  },
];

/* Step definitions */
const STEPS = [
  {
    num: "01",
    badgeKey: "docs_step1_badge",
    titleKey: "docs_step1_title",
    descKey: "docs_step1_desc",
  },
  {
    num: "02",
    badgeKey: "docs_step2_badge",
    titleKey: "docs_step2_title",
    descKey: "docs_step2_desc",
  },
  {
    num: "03",
    badgeKey: "docs_step3_badge",
    titleKey: "docs_step3_title",
    descKey: "docs_step3_desc",
    hasCommand: true,
  },
  {
    num: "04",
    badgeKey: "docs_step4_badge",
    titleKey: "docs_step4_title",
    descKey: "docs_step4_desc",
  },
];

const STEP_ICONS = {
  1: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="m8 21 4-4 4 4" />
      <path d="M12 17v4" />
      <path d="M7 10h.01M12 10h.01M17 10h.01" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 3h18v4H3z" />
      <path d="M3 11h18v4H3z" />
      <path d="M3 19h18v4H3z" opacity="0.4" />
      <path d="M7 5h2M7 13h2" />
    </svg>
  ),
};

export default function HowToStart() {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header block reveal */
      gsap.from(".docs-header > *", {
        x: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      /* Messenger cards fly-in */
      gsap.from(".messenger-bot-card", {
        y: 25,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });

      /* Step cards scroll-triggered stagger reveal */
      gsap.from(".step-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      /* Step number counter lines grow on scroll */
      gsap.from(".step-index-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      /* Code pill pulse on enter */
      gsap.from(".cmd-pill", {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cmd-pill",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-grow bg-yale-blue-950 text-lime-cream-50 font-sans relative">
      {/* Background Grid Pattern */}
      <div className="looping-bg-grid" />

      <div className="max-w-4xl w-full mx-auto px-6 md:px-12 pb-16">

        {/* Header */}
        <header className="pt-14 md:pt-20 pb-10 docs-header">
          <div className="inline-flex items-center gap-2 bg-tropical-teal-500 text-black text-xs font-mono font-bold neo-badge px-3 py-1 mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            {t("how_to_start")}
          </div>
          <h1 className="text-4xl md:text-6xl font-mono font-black tracking-tight uppercase leading-none text-lime-cream-200 mb-5">
            {t("docs_intro_title")}
          </h1>
          <p className="text-sm md:text-base font-mono text-lime-cream-300 max-w-xl leading-relaxed">
            {t("docs_intro_sub")}
          </p>
        </header>

        {/* Messenger Bots Block */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime-cream-500">
              {t("docs_bots_title")}
            </span>
            <div className="flex-1 h-px bg-lime-cream-800" />
          </div>

          <p className="text-xs font-mono text-lime-cream-400 mb-5 max-w-md leading-relaxed">
            {t("docs_bots_sub")}
          </p>

          {/* Bot cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MESSENGER_BOTS.map((bot) => (
              <a
                key={bot.id}
                href={bot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="messenger-card messenger-bot-card bg-yale-blue-900 p-5 flex items-center gap-4 no-underline group"
              >
                {/* Icon container */}
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-yale-blue-950 border-2 border-black">
                  <bot.Icon className="w-7 h-7" bgClass={bot.bgClass} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-widest text-lime-cream-500 font-mono mb-1">
                    {bot.name}
                  </div>
                  <div className="text-lime-cream-200 font-mono font-bold text-sm truncate group-hover:text-lime-cream-400 transition-colors duration-150">
                    {bot.handle}
                  </div>
                  <div className="text-[10px] text-lime-cream-600 font-mono mt-1">
                    {t("docs_bots_admin_note")}
                  </div>
                </div>

                {/* Arrow */}
                <LinkArrowIcon className="w-4 h-4 text-lime-cream-600 group-hover:text-lime-cream-300 transition-colors duration-150 flex-shrink-0 transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </section>

        {/* Steps Section */}
        <section className="steps-section">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-lime-cream-500">
              {t("how_to_start")}
            </span>
            <div className="flex-1 h-px bg-lime-cream-800" />
          </div>

          <div className="flex flex-col gap-0">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="step-card relative flex gap-5 pb-10 last:pb-0">

                {/* Left: step number column */}
                <div className="flex flex-col items-center flex-shrink-0 w-14">
                  {/* Circle badge */}
                  <div className="w-10 h-10 border-2 border-lime-cream-400 bg-yale-blue-950 flex items-center justify-center text-lime-cream-400 font-black font-mono text-xs z-10 relative neo-shadow-sm">
                    {STEP_ICONS[idx + 1]}
                  </div>

                  {/* Connector line to next step */}
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 w-px bg-gradient-to-b from-lime-cream-600 to-transparent mt-2" />
                  )}
                </div>

                {/* Right: step content */}
                <Card className="p-5 md:p-6 flex-1 mt-0">
                  {/* Step badge + horizontal rule */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-lime-cream-600 font-mono">
                      {t(step.badgeKey)}
                    </span>
                    <div className="step-index-line flex-1 h-px bg-lime-cream-800" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-mono font-bold uppercase tracking-tight mb-2 text-lime-cream-200 leading-snug">
                    {t(step.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm font-mono text-lime-cream-400 leading-relaxed max-w-prose">
                    {t(step.descKey)}
                  </p>

                  {/* /connect command pill */}
                  {step.hasCommand && (
                    <div className="mt-4">
                      <span className="cmd-pill code-pill">
                        {t("docs_connect_cmd")}
                      </span>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-black mt-16 pt-8 flex justify-between items-center text-xs font-mono text-lime-cream-600">
          <div>&copy; {t("footer_text")}</div>
        </footer>
      </div>
    </div>
  );
}
