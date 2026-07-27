"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
import { useLanguage } from "@/context/LanguageContext";

/* Neo-Brutalist Add Bridge Form Component */
export default function AddBridgeForm({ chats, onSubmit, onCancel }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sourceChatOptions = chats.map((c) => ({
    value: `${c.platform}:${c.id}`,
    label: `${c.platform === "vk" ? "VK" : "Telegram"}: ${c.name}`
  }));

  const targetChatOptions = chats
    .filter((c) => !source || `${c.platform}:${c.id}` !== source)
    .map((c) => ({
      value: `${c.platform}:${c.id}`,
      label: `${c.platform === "vk" ? "VK" : "Telegram"}: ${c.name}`
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !source || !target || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title, source, target });
      setTitle("");
      setSource("");
      setTarget("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-6 create-route-form">
        <h3 className="text-lg font-mono font-bold uppercase border-b-2 border-black pb-2 text-lime-cream-200">
          {t("config_pipeline")}
        </h3>

        <Input
          label={t("pipeline_name")}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("placeholder_pipeline_name")}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-lime-cream-300 mb-2">
              {t("source_chat")}
            </label>
            <Dropdown
              value={source}
              onChange={(val) => setSource(val)}
              options={sourceChatOptions}
              placeholder={t("choose_source")}
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-lime-cream-300 mb-2">
              {t("target_chat")}
            </label>
            <Dropdown
              value={target}
              onChange={(val) => setTarget(val)}
              options={targetChatOptions}
              placeholder={t("choose_target")}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {t("close")}
            </Button>
          )}
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {t("save_pipeline")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
