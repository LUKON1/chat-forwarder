"use client";

import React from "react";
import VkIcon from "@/assets/icons/VkIcon";
import TelegramIcon from "@/assets/icons/TelegramIcon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";

/* Neo-Brutalist Connected Chats List Component */
export default function ConnectedChatList({ chats, onDeleteChat }) {
  const { t } = useLanguage();

  const vkChats = chats.filter((c) => c.platform === "vk");
  const tgChats = chats.filter((c) => c.platform === "tg");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* VKontakte Column */}
      <Card className="p-4 sm:p-6 flex flex-col space-y-4 chats-column">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center space-x-2">
            <VkIcon className="w-6 h-6 flex-shrink-0" />
            <h3 className="text-lg font-mono font-bold uppercase text-lime-cream-100">VKontakte</h3>
          </div>
          <Badge variant="vk">{vkChats.length}</Badge>
        </div>

        {vkChats.length === 0 ? (
          <p className="text-xs text-lime-cream-200/60 py-6 text-center font-mono">{t("no_vk_chats")}</p>
        ) : (
          <div className="space-y-3">
            {vkChats.map((chat) => (
              <div key={chat.id} className="p-3 sm:p-4 bg-yale-blue-950 border-2 border-black flex justify-between items-center min-w-0 gap-2">
                <div className="min-w-0">
                  <h4 className="font-mono font-bold text-lime-cream-200 truncate text-sm">{chat.name}</h4>
                  <span className="text-[10px] font-mono text-lime-cream-200/60 block truncate">{chat.externalId}</span>
                </div>
                <Button
                  onClick={() => onDeleteChat("vk", chat.id)}
                  variant="danger"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {t("remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Telegram Column */}
      <Card className="p-4 sm:p-6 flex flex-col space-y-4 chats-column">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center space-x-2">
            <TelegramIcon className="w-6 h-6 flex-shrink-0" />
            <h3 className="text-lg font-mono font-bold uppercase text-lime-cream-100">Telegram</h3>
          </div>
          <Badge variant="tg">{tgChats.length}</Badge>
        </div>

        {tgChats.length === 0 ? (
          <p className="text-xs text-lime-cream-200/60 py-6 text-center font-mono">{t("no_tg_chats")}</p>
        ) : (
          <div className="space-y-3">
            {tgChats.map((chat) => (
              <div key={chat.id} className="p-3 sm:p-4 bg-yale-blue-950 border-2 border-black flex justify-between items-center min-w-0 gap-2">
                <div className="min-w-0">
                  <h4 className="font-mono font-bold text-lime-cream-200 truncate text-sm">{chat.name}</h4>
                  <span className="text-[10px] font-mono text-lime-cream-200/60 block truncate">{chat.externalId}</span>
                </div>
                <Button
                  onClick={() => onDeleteChat("tg", chat.id)}
                  variant="danger"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {t("remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
