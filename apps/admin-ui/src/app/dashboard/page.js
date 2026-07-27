"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import BridgeCard from "@/components/dashboard/BridgeCard";
import ConnectedChatList from "@/components/dashboard/ConnectedChatList";
import AddBridgeForm from "@/components/dashboard/AddBridgeForm";
import ConnectChatBox from "@/components/dashboard/ConnectChatBox";
import { gsap } from "gsap";

/* Storage keys dictionary for versioning */
const STORAGE_KEYS = {
  IS_LOGGED_IN: "is_logged_in:v1",
  TOKEN: "token:v1",
  USER: "user:v1",
  REFRESH_TOKEN: "refresh_token:v1",
};

export default function Dashboard() {
  const { push } = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("routes");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tabContentRef = useRef(null);

  /* Real database state for chats and routes */
  const [chats, setChats] = useState([]);
  const [routes, setRoutes] = useState([]);

  /* API connection & loading state */
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  /* Onboarding Pin Code Generation */
  const [codePlatform, setCodePlatform] = useState("vk");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);

  /* Form state */
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  /* Modal state */
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

  /* Smooth page and tab transitions */
  useEffect(() => {
    if (isLoading) return;

    gsap.fromTo(tabContentRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [activeTab, isLoading]);

  const showModal = useCallback((title, message, type = "info") => {
    setModalConfig({ isOpen: true, title, message, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /* Handle log out */
  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          credentials: "include"
        });
      }
    } catch (err) {
      console.error("Failed to notify server about logout:", err);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setIsAuthenticated(false);
      push("/login");
    }
  }, [push]);

  /* Helper to fetch with automatic token refresh */
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    let token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!options.headers) {
      options.headers = {};
    }
    options.headers["Authorization"] = `Bearer ${token}`;

    let res = await fetch(url, options);

    if (res.status === 401) {
      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem(STORAGE_KEYS.TOKEN, refreshData.accessToken);
          
          options.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          res = await fetch(url, options);
        } else {
          handleLogout();
          throw new Error("Session expired");
        }
      } catch (err) {
        handleLogout();
        throw err;
      }
    }

    return res;
  }, [handleLogout]);

  /* Load chats and pipelines from bot engine API */
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setApiError("");
    try {
      const chatsRes = await fetchWithAuth("/api/chats");
      const bridgesRes = await fetchWithAuth("/api/bridges");

      if (!chatsRes.ok || !bridgesRes.ok) {
        throw new Error("Failed to load dashboard data from API");
      }

      const chatsData = await chatsRes.json();
      const bridgesData = await bridgesRes.json();

      const flatChats = [
        ...(chatsData.vk || []).map((c) => ({ id: c.chatId, name: c.title, platform: "vk", externalId: String(c.chatId) })),
        ...(chatsData.tg || []).map((c) => ({ id: c.chatId, name: c.title, platform: "tg", externalId: String(c.chatId) }))
      ];
      setChats(flatChats);

      const mappedRoutes = (bridgesData || []).map((r) => ({
        id: r.id,
        title: r.title || `${r.sourcePlatform.toUpperCase()} -> ${r.targetPlatform.toUpperCase()}`,
        sourceId: r.sourceChatId,
        sourcePlatform: r.sourcePlatform,
        targetId: r.targetChatId,
        targetPlatform: r.targetPlatform,
        isReversed: r.isReversed === true || r.isReversed === 1,
        isActive: r.isActive === true || r.isActive === 1,
        showAuthor: r.showAuthor == null ? true : (r.showAuthor === true || r.showAuthor === 1)
      }));
      setRoutes(mappedRoutes);
    } catch (err) {
      console.error(err);
      setApiError(t("cannot_connect_api"));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [fetchWithAuth, t]);

  /* Validate authentication and fetch data on mount */
  useEffect(() => {
    const loggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!loggedIn || !token) {
      push("/login");
    } else {
      setTimeout(() => {
        setIsAuthenticated(true);
        loadData();
      }, 0);
    }
  }, [push, loadData]);

  /* Poll connected chats when onboarding code is active */
  useEffect(() => {
    if (!generatedCode) return;

    const initialChatsCount = chats.length;

    const interval = setInterval(async () => {
      try {
        const chatsRes = await fetchWithAuth("/api/chats");
        if (chatsRes.ok) {
          const chatsData = await chatsRes.json();
          const currentCount = (chatsData.vk || []).length + (chatsData.tg || []).length;
          
          if (currentCount > initialChatsCount) {
            loadData(true);
            setGeneratedCode(null);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Polling chats failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [generatedCode, chats.length, fetchWithAuth, loadData]);

  /* Generate temporary onboarding PIN for connecting chats */
  const handleGenerateCode = async () => {
    if (generatingCode) return;
    setGeneratedCode(null);
    setGeneratingCode(true);

    try {
      const res = await fetchWithAuth("/api/connect/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: codePlatform })
      });

      const data = await res.json();
      if (res.ok && data.code) {
        setGeneratedCode(data.code);
      } else {
        showModal(t("error_label"), t(data.error || "Failed to generate code"), "error");
      }
    } catch (err) {
      console.error(err);
      showModal(t("error_label"), t("API server connection failed"), "error");
    } finally {
      setGeneratingCode(false);
    }
  };

  /* Disconnect chat from pool */
  const handleDeleteChat = async (platform, chatId) => {
    try {
      const res = await fetchWithAuth(`/api/chats/${platform}/${chatId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadData(true);
      } else {
        const data = await res.json();
        showModal(t("error_label"), t(data.error || "Failed to disconnect chat"), "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Add new routing pipeline */
  const handleCreateRoute = async ({ title, source, target }) => {
    const [sourcePlatform, sourceId] = source.split(":");
    const [targetPlatform, targetId] = target.split(":");

    try {
      const res = await fetchWithAuth("/api/bridges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          sourcePlatform,
          sourceChatId: Number(sourceId),
          targetPlatform,
          targetChatId: Number(targetId),
          showAuthor: true
        })
      });

      if (res.ok) {
        setIsCreatingRoute(false);
        loadData(true);
      } else {
        const data = await res.json();
        showModal(t("error_label"), t(data.error || "Failed to create pipeline"), "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Reverse bridge direction flow */
  const handleReverseDirection = async (route) => {
    try {
      const res = await fetchWithAuth(`/api/bridges/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReversed: !route.isReversed })
      });
      if (res.ok) {
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Toggle sender name prefix forwarding setting */
  const handleToggleShowAuthor = async (route) => {
    try {
      const res = await fetchWithAuth(`/api/bridges/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showAuthor: !route.showAuthor })
      });
      if (res.ok) {
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Toggle active/paused state for bridge routing */
  const handleToggleActive = async (route) => {
    try {
      const res = await fetchWithAuth(`/api/bridges/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !route.isActive })
      });
      if (res.ok) {
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Delete bridge */
  const handleDeleteRoute = async (id) => {
    try {
      const res = await fetchWithAuth(`/api/bridges/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yale-blue-950 text-lime-cream-50 font-mono text-sm">
        {t("loading_auth_state")}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-yale-blue-950 text-lime-cream-50 font-sans relative">
      <div className="looping-bg-grid" />

      {/* Main Container */}
      <main className="grow max-w-5xl w-full mx-auto p-6 md:p-10 z-10 flex flex-col">
        {apiError && (
          <div className="bg-rose-900 border-2 border-black text-lime-cream-50 text-xs font-mono p-4 mb-8 neo-shadow-md">
            {t("error_label")}: {apiError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b-4 border-black mb-10 space-x-2 text-sm font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("routes")}
            type="button"
            className={`px-6 py-3 border-t-2 border-x-2 border-black transition-transform duration-75 ${
              activeTab === "routes"
                ? "bg-lime-cream-400 text-black border-b-4 border-b-lime-cream-400 translate-y-1"
                : "bg-yale-blue-900 text-lime-cream-300 hover:text-lime-cream-50"
            }`}
          >
            {t("routes_tab")}
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            type="button"
            className={`px-6 py-3 border-t-2 border-x-2 border-black transition-transform duration-75 ${
              activeTab === "chats"
                ? "bg-lime-cream-400 text-black border-b-4 border-b-lime-cream-400 translate-y-1"
                : "bg-yale-blue-900 text-lime-cream-300 hover:text-lime-cream-50"
            }`}
          >
            {t("chats_tab")}
          </button>
        </div>

        {/* Tab content */}
        <div ref={tabContentRef} className="grow">
          {isLoading ? (
            <Card className="p-12 text-center font-mono text-lime-cream-300 text-sm">
              {t("sync_with_api")}
            </Card>
          ) : (
            <>
              {/* Tab 1: Routes */}
              {activeTab === "routes" && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
                    <div>
                      <h2 className="text-2xl font-mono font-black uppercase text-lime-cream-200">{t("active_routes")}</h2>
                      <p className="text-xs text-lime-cream-400 font-mono mt-1">{t("total_routes")}: {routes.length}</p>
                    </div>
                    <Button
                      onClick={() => setIsCreatingRoute(!isCreatingRoute)}
                      variant="accent"
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      {isCreatingRoute ? t("close") : t("create_route")}
                    </Button>
                  </div>

                  {/* Create Route Form */}
                  {isCreatingRoute && (
                    <AddBridgeForm
                      chats={chats}
                      onSubmit={handleCreateRoute}
                      onCancel={() => setIsCreatingRoute(false)}
                    />
                  )}

                  {/* Empty State */}
                  {routes.length === 0 && (
                    <Card className="p-12 text-center space-y-4">
                      <h3 className="text-xl font-mono font-bold uppercase text-lime-cream-300">{t("no_pipelines")}</h3>
                      <p className="text-lime-cream-400 max-w-md mx-auto text-xs font-mono">
                        {t("no_pipelines_desc")}
                      </p>
                      <Button 
                        onClick={() => setIsCreatingRoute(true)}
                        variant="accent"
                        size="sm"
                      >
                        {t("add_first_route")}
                      </Button>
                    </Card>
                  )}

                  {/* Routes List */}
                  <div className="space-y-6">
                    {routes.map((route) => {
                      const sourceChat = chats.find((c) => c.platform === route.sourcePlatform && c.id === route.sourceId);
                      const targetChat = chats.find((c) => c.platform === route.targetPlatform && c.id === route.targetId);

                      return (
                        <BridgeCard
                          key={route.id}
                          route={route}
                          sourceChat={sourceChat}
                          targetChat={targetChat}
                          onToggleAuthor={handleToggleShowAuthor}
                          onToggleActive={handleToggleActive}
                          onReverseDirection={handleReverseDirection}
                          onDelete={handleDeleteRoute}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Chats Pool */}
              {activeTab === "chats" && (
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="border-b-2 border-black pb-4">
                      <h2 className="text-2xl font-mono font-black uppercase text-lime-cream-200">{t("chats_tab")}</h2>
                      <p className="text-xs text-lime-cream-400 font-mono mt-1">
                        {t("chats_pool_desc")}
                      </p>
                    </div>

                    <ConnectedChatList chats={chats} onDeleteChat={handleDeleteChat} />
                  </div>

                  {/* Connect New Chat Box */}
                  <ConnectChatBox
                    onGenerateCode={handleGenerateCode}
                    generatedCode={generatedCode}
                    generatingCode={generatingCode}
                    codePlatform={codePlatform}
                    setCodePlatform={setCodePlatform}
                    setGeneratedCode={setGeneratedCode}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Global Notification Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
      >
        <p className="font-mono text-sm text-lime-cream-100 mb-6 leading-relaxed">
          {modalConfig.message}
        </p>
        <div className="flex justify-end">
          <Button onClick={closeModal} variant="primary">
            {t("close")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
