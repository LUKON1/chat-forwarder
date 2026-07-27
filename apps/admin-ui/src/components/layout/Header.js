"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/layout/Logo";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import { gsap } from "gsap";

const languageOptions = [
  { value: "ru", label: "RU" },
  { value: "en", label: "EN" }
];

const STORAGE_KEYS = {
  IS_LOGGED_IN: "is_logged_in:v1",
  TOKEN: "token:v1",
  USER: "user:v1",
  REFRESH_TOKEN: "refresh_token:v1",
};

/**
 * Global Header navigation component with mobile adaptation
 */
export default function Header() {
  const pathname = usePathname();
  const { push } = useRouter();
  const { locale, t, changeLocale } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  /* Check authentication status on mount and path changes */
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const loggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true";
      setIsLoggedIn(loggedIn);
      setIsMenuOpen(false);
    }, 0);
  }, [pathname]);

  /* Handle mobile menu slide/fade transition with GSAP */
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMenuOpen) {
      gsap.killTweensOf(mobileMenuRef.current);
      gsap.to(mobileMenuRef.current, {
        autoAlpha: 1,
        height: "auto",
        duration: 0.35,
        ease: "power2.out"
      });
    } else {
      gsap.killTweensOf(mobileMenuRef.current);
      gsap.to(mobileMenuRef.current, {
        autoAlpha: 0,
        height: 0,
        duration: 0.25,
        ease: "power2.in"
      });
    }
  }, [isMenuOpen]);

  /* Handle system log out */
  const handleLogout = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        });
      } catch (err) {
        console.error("Failed to notify server about logout:", err);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setIsLoggedIn(false);
    push("/login");
  }, [push]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b-4 border-black bg-yale-blue-900 select-none">
      {/* Brand Identity / Clickable Logo */}
      <Link href="/" className="flex items-center space-x-3 group">
        <Logo className="w-12 h-12 md:w-15 md:h-15" spin={true} />
        <span className="font-mono font-bold tracking-tight text-lg md:text-xl text-lime-cream-100 group-hover:text-lime-cream-300 transition-colors">
          {t("title")}
        </span>
      </Link>

      {/* Desktop Navigation Controls */}
      <div className="hidden md:flex items-center space-x-4">
        <Dropdown
          value={locale}
          onChange={changeLocale}
          options={languageOptions}
          className="w-20"
        />

        {mounted && (isLoggedIn ? (
          <>
            {pathname !== "/dashboard" && (
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  {t("dashboard_preview")}
                </Button>
              </Link>
            )}
            {pathname !== "/how-to-start" && (
              <Link href="/how-to-start">
                <Button variant="secondary" size="sm">
                  {t("how_to_start")}
                </Button>
              </Link>
            )}
            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              {t("logout")}
            </Button>
          </>
        ) : (
          <>
            {pathname !== "/how-to-start" && (
              <Link href="/how-to-start">
                <Button variant="secondary" size="sm">
                  {t("how_to_start")}
                </Button>
              </Link>
            )}
            {pathname !== "/login" && (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  {t("signin")}
                </Button>
              </Link>
            )}
            {pathname !== "/register" && (
              <Link href="/register">
                <Button variant="primary" size="sm">
                  {t("signup")}
                </Button>
              </Link>
            )}
          </>
        ))}
      </div>

      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 neo-button neo-button-secondary text-lime-cream-200 focus:outline-none"
        aria-label="Toggle navigation menu"
        type="button"
      >
        <div className="w-6 h-5 flex flex-col justify-between items-center relative py-0.5">
          <span className={`w-5 h-0.75 bg-current transition-all duration-300 rounded-sm ${isMenuOpen ? "rotate-45 translate-y-1.75" : ""}`} />
          <span className={`w-5 h-0.75 bg-current transition-all duration-300 rounded-sm ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.75 bg-current transition-all duration-300 rounded-sm ${isMenuOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
        </div>
      </button>

      {/* Mobile Navigation Dropdown */}
      <div 
        ref={mobileMenuRef}
        className="absolute top-full left-0 right-0 bg-yale-blue-900 neo-shadow-lg z-40 md:hidden invisible opacity-0 overflow-hidden"
        style={{ height: 0 }}
      >
        <div className="px-6 py-6 border-b-4 border-black flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime-cream-300">
              {locale === "ru" ? "Язык / Language" : "Language / Язык"}
            </span>
            <Dropdown
              value={locale}
              onChange={changeLocale}
              options={languageOptions}
              className="w-20"
            />
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            {mounted && (isLoggedIn ? (
              <>
                {pathname !== "/dashboard" && (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      {t("dashboard_preview")}
                    </Button>
                  </Link>
                )}
                {pathname !== "/how-to-start" && (
                  <Link href="/how-to-start" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      {t("how_to_start")}
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  variant="danger"
                  className="w-full"
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                {pathname !== "/how-to-start" && (
                  <Link href="/how-to-start" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      {t("how_to_start")}
                    </Button>
                  </Link>
                )}
                {pathname !== "/login" && (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      {t("signin")}
                    </Button>
                  </Link>
                )}
                {pathname !== "/register" && (
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      {t("signup")}
                    </Button>
                  </Link>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
