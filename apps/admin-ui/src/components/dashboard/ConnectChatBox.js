"use client";

import React, { useState } from "react";
import VkIcon from "@/assets/icons/VkIcon";
import TelegramIcon from "@/assets/icons/TelegramIcon";
import LinkArrowIcon from "@/assets/icons/LinkArrowIcon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";

const platformOptions = [
  {
    id: "vk",
    name: "VKontakte",
    handle: "Chats Forwarder",
    url: "https://vk.com/club239265109",
    Icon: VkIcon,
  },
  {
    id: "tg",
    name: "Telegram",
    handle: "@chatsForwarderbot",
    url: "https://t.me/chatsForwarderbot",
    Icon: TelegramIcon,
  }
];

/* Neo-Brutalist Connect Chat Onboarding Component */
export default function ConnectChatBox({
  onGenerateCode,
  generatedCode,
  generatingCode,
  codePlatform,
  setCodePlatform,
  setGeneratedCode,
}) {
  const { t } = useLanguage();
  const [copiedCommand, setCopiedCommand] = useState(false);

  const selectedPlatformInfo = platformOptions.find((p) => p.id === codePlatform) || platformOptions[0];
  const SelectedIcon = selectedPlatformInfo.Icon;

  const handleCopyCommand = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(`/connect ${generatedCode}`);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 1500);
  };

  return (
    <Card className="p-4 sm:p-6 space-y-6">
      <h3 className="text-lg font-mono font-bold uppercase border-b-2 border-black pb-2 text-lime-cream-200">
        {t("connect_new_chat")}
      </h3>

      <div className="space-y-6">
        {/* Step 1: Select platform */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-lime-cream-300">
            {t("select_platform_label")}
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {platformOptions.map((platform) => {
              const isSelected = codePlatform === platform.id;
              const PlatformIcon = platform.Icon;
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => {
                    setCodePlatform(platform.id);
                    setGeneratedCode(null);
                  }}
                  className={`flex items-center gap-3 p-4 bg-yale-blue-950 border-2 transition-all text-left select-none cursor-pointer ${
                    isSelected
                      ? "border-lime-cream-400 neo-shadow-md"
                      : "border-black hover:border-lime-cream-600/50 hover:bg-yale-blue-900"
                  }`}
                >
                  <PlatformIcon className="w-6 h-6 flex-shrink-0" />
                  <span className="font-mono text-sm font-bold text-lime-cream-100">{platform.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Platform Bot Link Info Block */}
        {selectedPlatformInfo && (
          <div className="p-4 bg-yale-blue-950 border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SelectedIcon className="w-7 h-7 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wide text-lime-cream-400">
                  {t("bot_link_hint")}
                </div>
                <div className="text-sm font-mono font-bold text-lime-cream-100">
                  {selectedPlatformInfo.name} ({selectedPlatformInfo.handle})
                </div>
              </div>
            </div>
            <a
              href={selectedPlatformInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button neo-button-secondary text-xs px-3 py-2 flex items-center justify-center gap-2 no-underline"
            >
              <span>{t("open_in_messenger")}</span>
              <LinkArrowIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Step 2: Generate PIN code */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button
              onClick={onGenerateCode}
              isLoading={generatingCode}
              variant="primary"
              className="w-full sm:w-auto"
            >
              {t("generate_code")}
            </Button>
          </div>

          {generatedCode && (
            <div className="p-4 sm:p-6 bg-yale-blue-950 border-2 border-lime-cream-400 neo-shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-lime-cream-300 uppercase">
                    {t("pin_code_title")}
                  </div>
                  <div className="text-3xl font-mono font-black text-lime-cream-400 tracking-widest mt-1">
                    {generatedCode}
                  </div>
                </div>
                <div>
                  <Button onClick={handleCopyCommand} variant="accent" size="sm">
                    {copiedCommand ? t("copied") : t("copy_command")}
                  </Button>
                </div>
              </div>

              {/* Onboarding Instructions */}
              <div className="border-t border-yale-blue-800 pt-3 text-xs font-mono text-lime-cream-200/80 space-y-2">
                <p>1. {t("onboarding_step_1")}</p>
                <p>
                  2. {t("onboarding_step_2")}{" "}
                  <span className="code-pill">/connect {generatedCode}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
