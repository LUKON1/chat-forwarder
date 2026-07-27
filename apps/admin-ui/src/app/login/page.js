"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

const STORAGE_KEYS = {
  IS_LOGGED_IN: "is_logged_in:v1",
  TOKEN: "token:v1",
  USER: "user:v1",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const { t } = useLanguage();
  const formRef = useRef(null);

  /* Entrance animation for the login card */
  useEffect(() => {
    gsap.from(formRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out"
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    if (username.length < 3 || username.length > 20) {
      setError(t("username_too_short"));
      return;
    }

    if (password.length < 6) {
      setError(t("password_too_short"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || t("invalid_credentials"));
        return;
      }

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.accessToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        push("/dashboard");
      } else {
        setError(data.error || t("invalid_credentials"));
      }
    } catch (err) {
      setError(t("server_connection_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-yale-blue-950 text-lime-cream-50 p-6 font-sans relative">
      <div className="looping-bg-grid" />

      {/* Auth Card */}
      <div ref={formRef} className="w-full max-w-md">
        <Card size="lg" className="p-8 relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-lime-cream-400 border-b-2 border-black" />

          <div className="text-center mb-8 mt-2">
            <h2 className="text-xl font-mono font-bold uppercase tracking-wide text-lime-cream-200">{t("sys_auth")}</h2>
          </div>
          
          {error && (
            <div className="bg-rose-900 border-2 border-black text-lime-cream-50 text-xs font-mono p-3 mb-6 neo-shadow-sm">
              {t("error_label")}: {t(error)}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label={t("username")}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("placeholder_username")}
              required
            />
            <Input
              label={t("password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              {t("login_btn")}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs font-mono text-lime-cream-400">
            {t("first_time")}{" "}
            <Link href="/register" className="underline font-bold text-lime-cream-200 hover:text-lime-cream-100">
              {t("register_btn")}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
