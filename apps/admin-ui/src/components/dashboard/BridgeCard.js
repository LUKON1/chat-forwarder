"use client";

import React from "react";
import VkIcon from "@/assets/icons/VkIcon";
import TelegramIcon from "@/assets/icons/TelegramIcon";
import FlowArrowIcon from "@/assets/icons/FlowArrowIcon";
import MessageFlowAnimation from "@/components/landing/MessageFlowAnimation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";

/* Neo-Brutalist Bridge Route Card Component */
export default function BridgeCard({
  route,
  sourceChat,
  targetChat,
  onToggleAuthor,
  onToggleActive,
  onReverseDirection,
  onDelete,
}) {
  const { t } = useLanguage();
  const flowDirection = route.isReversed ? "right-to-left" : "left-to-right";
  const isActive = route.isActive !== false;

  return (
    <Card className="flex flex-col relative overflow-hidden route-card p-0">
      {/* Top state accent bar */}
      <div className={`h-2 border-b-2 border-black ${isActive ? "bg-lime-cream-400" : "bg-amber-400"}`} />
      
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Details */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Minimalist Healthcheck LED Indicator */}
            <span
              title={isActive ? t("health_ok") : t("paused")}
              className={`w-2.5 h-2.5 rounded-full inline-block cursor-help ${
                isActive
                  ? "bg-lime-cream-400 animate-pulse shadow-[0_0_8px_#c3e250]"
                  : "bg-amber-400"
              }`}
            />
            <h3 className="text-lg font-mono font-bold uppercase text-lime-cream-200">
              {route.title}
            </h3>
          </div>
          
          {/* Top Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <Button
              onClick={() => onToggleAuthor(route)}
              variant={route.showAuthor ? "accent" : "secondary"}
              size="sm"
            >
              {route.showAuthor ? t("author_shown") : t("author_hidden")}
            </Button>
            
            {/* Interactive Active/Pause Toggle Button */}
            <Button
              onClick={() => onToggleActive && onToggleActive(route)}
              variant={isActive ? "primary" : "secondary"}
              size="sm"
            >
              {isActive ? t("active") : t("paused")}
            </Button>

            <Button
              onClick={() => onDelete(route.id)}
              variant="danger"
              size="sm"
            >
              {t("delete")}
            </Button>
          </div>
        </div>

        {/* Pipeline Node visualization */}
        <div className="relative pb-28">
          <div className="flex justify-between items-center bg-yale-blue-950 p-3 sm:p-4 border-2 border-black relative z-20 min-w-0 gap-2">
            {/* Left Platform Node */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              {route.sourcePlatform === "vk" ? (
                <VkIcon className="w-8 h-8 flex-shrink-0" />
              ) : (
                <TelegramIcon className="w-8 h-8 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wide text-lime-cream-400">{t("source")}</div>
                <div className="text-xs sm:text-sm font-mono font-bold uppercase text-lime-cream-200 truncate max-w-[120px] sm:max-w-[200px]">
                  {sourceChat ? sourceChat.name : t("chat_deleted")}
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-lime-cream-200/60 truncate max-w-[120px] sm:max-w-[200px]">
                  {sourceChat ? sourceChat.externalId : t("none")}
                </div>
              </div>
            </div>

            {/* Center interactive reverse direction button */}
            <Button
              onClick={() => onReverseDirection(route)}
              variant="accent"
              size="sm"
              title={t("reverse_direction")}
              className="w-10 h-10 p-0 flex items-center justify-center flex-shrink-0"
            >
              <FlowArrowIcon reversed={route.isReversed} className="w-6 h-6" />
            </Button>

            {/* Right Platform Node */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-right min-w-0">
              <div className="min-w-0">
                <div className="text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wide text-lime-cream-400">{t("destination")}</div>
                <div className="text-xs sm:text-sm font-mono font-bold uppercase text-lime-cream-200 truncate max-w-[120px] sm:max-w-[200px]">
                  {targetChat ? targetChat.name : t("chat_deleted")}
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-lime-cream-200/60 truncate max-w-[120px] sm:max-w-[200px]">
                  {targetChat ? targetChat.externalId : t("none")}
                </div>
              </div>
              {route.targetPlatform === "vk" ? (
                <VkIcon className="w-8 h-8 flex-shrink-0" />
              ) : (
                <TelegramIcon className="w-8 h-8 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Message Flow visual animation */}
          <MessageFlowAnimation 
            direction={flowDirection} 
            sourcePlatform={route.isReversed ? route.targetPlatform : route.sourcePlatform}
            isMoving={isActive} 
            padding={16}
            iconSize={32}
          />
        </div>
      </div>
    </Card>
  );
}
