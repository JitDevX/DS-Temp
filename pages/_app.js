// pages/_app.js
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuCalendar,
  LuLayers,
  LuCoffee,
  LuSettings,
  LuMoon,
  LuSun,
  LuLogOut,
} from "react-icons/lu";

import "../styles/globals.css";
import CursorLoader from "@/components/CursorLoader";

const NAV_ITEMS = [
  { label: "Daily", route: "/?tab=Daily", tabId: "Daily", icon: LuCalendar },
  { label: "Combined", route: "/?tab=Combined", tabId: "Combined", icon: LuLayers },
  { label: "Morning Meeting", route: "/morningMeeting", tabId: "Meeting", icon: LuCoffee },
];

// SIDEBAR COMPONENT
function Sidebar({ router, theme, toggleTheme, onLogout }) {
  const isDark = theme === "dark";

  return (
    <aside
      className={`w-[270px] h-screen shrink-0 flex flex-col border-r transition-colors duration-200 z-10 ${
        isDark
          ? "bg-black border-white/10 text-white"
          : "bg-white border-[#E5E7EB] text-[#101828]"
      }`}
    >
      {/* ── Logo Header ── */}
      <div
        className={`relative shrink-0 flex items-center gap-3 px-5 py-5 border-b ${
          isDark ? "border-white/10" : "border-[#E5E7EB]"
        }`}
      >
        {/* Glow line at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

        <img src="/logo.svg" alt="Safepad logo" className="w-11 h-11 shrink-0" />

        <div className="flex flex-col leading-none">
          <span
            className={`text-[17px] font-bold tracking-[0.2em] ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            SAFEPAD
          </span>
          <span
            className={`mt-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase ${
              isDark ? "text-purple-300/90" : "text-purple-500/90"
            }`}
          >
            RigMind
          </span>
        </div>
      </div>

      {/* ── Navigation (scrollable) ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isQueryTab = item.route.startsWith('/?');
          const isActive = isQueryTab 
            ? (router.query.tab === item.tabId || (router.pathname === '/' && !router.query.tab && item.tabId === 'Daily'))
            : router.pathname === item.route;
          const Icon = item.icon;

          return (
            <Link
              key={item.route}
              href={item.route}
              className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-150 ${
                isActive
                  ? isDark
                    ? "bg-purple-500/10 border border-purple-500/25"
                    : "bg-purple-500/[0.07] border border-purple-500/20 shadow-sm"
                  : isDark
                  ? "hover:bg-white/[0.07]"
                  : "hover:bg-[#F4F6F8] border border-transparent"
              }`}
            >
              {/* Active left bar */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-purple-500`}
                />
              )}

              {/* Icon box */}
              <span
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-[0_8px_24px_rgba(147,51,234,0.25)]"
                    : isDark
                    ? "bg-white/[0.06] text-white/55 group-hover:bg-white/10 group-hover:text-white"
                    : "bg-[#F4F6F8] text-[#667085] group-hover:bg-[#E9ECF0] group-hover:text-[#101828]"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </span>

              {/* Label */}
              <span
                className={`text-[14px] leading-snug font-semibold ${
                  isActive
                    ? isDark
                      ? "text-[#EDF1F7]"
                      : "text-[#101828]"
                    : isDark
                    ? "text-white/80 group-hover:text-white"
                    : "text-[#667085] group-hover:text-[#101828]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        className={`shrink-0 flex items-center justify-center gap-4 px-3 py-4 border-t ${
          isDark ? "border-[#262F3F]" : "border-[#E5E7EB]"
        }`}
      >
        {/* Theme toggle pill */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
          className={`group flex shrink-0 cursor-pointer items-center rounded-2xl p-1.5 transition-all duration-300 ease-in-out ${
            isDark
              ? "bg-white text-black hover:bg-white/90 shadow-sm"
              : "bg-[#101828] text-white hover:bg-[#101828]/85 shadow-sm"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              isDark ? "bg-black/[0.06] text-purple-600" : "bg-white/[0.12] text-purple-500"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.16 }}
                className="flex items-center justify-center"
              >
                {isDark ? (
                  <LuSun className="w-[17px] h-[17px]" />
                ) : (
                  <LuMoon className="w-[17px] h-[17px]" />
                )}
              </motion.span>
            </AnimatePresence>
          </span>

          {/* Expanding label on hover */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-semibold opacity-0 transition-all duration-300 ease-in-out group-hover:ml-1.5 group-hover:max-w-[56px] group-hover:pr-2 group-hover:opacity-100">
            {isDark ? "Light" : "Dark"}
          </span>
        </button>

        {/* Settings pill (Middle) */}
        {(() => {
          const isSettingsActive = router.pathname === "/settings";
          return (
            <Link
              href="/settings"
              title="Settings"
              className={`group flex shrink-0 cursor-pointer items-center rounded-2xl p-1.5 transition-all duration-300 ease-in-out ${
                isSettingsActive
                  ? isDark
                    ? "bg-purple-500/10 border border-purple-500/25 text-purple-400"
                    : "bg-purple-500/[0.07] border border-purple-500/20 text-purple-600 shadow-sm"
                  : isDark
                  ? "bg-[#1B2431] text-[#9CA7BC] hover:bg-[#222C3C] hover:text-[#EDF1F7]"
                  : "bg-[#F4F6F8] text-[#667085] hover:bg-[#E9ECF0] hover:text-[#101828]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-150 ${
                  isSettingsActive
                    ? isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"
                    : isDark
                    ? "bg-black/20"
                    : "bg-white shadow-sm"
                }`}
              >
                <LuSettings className="w-[17px] h-[17px]" />
              </span>

              <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-semibold opacity-0 transition-all duration-300 ease-in-out group-hover:ml-1.5 group-hover:max-w-[65px] group-hover:pr-2 group-hover:opacity-100">
                Settings
              </span>
            </Link>
          );
        })()}

        {/* Sign out pill (Right) */}
        <button
          onClick={onLogout}
          title="Sign out"
          className={`group flex shrink-0 cursor-pointer items-center rounded-2xl p-1.5 transition-all duration-300 ease-in-out ${
            isDark
              ? "bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white"
              : "bg-red-50 text-red-700 hover:bg-red-600 hover:text-white shadow-sm"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              isDark ? "bg-red-500/20 group-hover:bg-black/20" : "bg-white group-hover:bg-white/20 shadow-sm group-hover:shadow-none"
            }`}
          >
            <LuLogOut className="w-[17px] h-[17px]" />
          </span>

          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-semibold opacity-0 transition-all duration-300 ease-in-out group-hover:ml-1.5 group-hover:max-w-[65px] group-hover:pr-2 group-hover:opacity-100">
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}

// Pages that should render WITHOUT the sidebar layout
const AUTH_PAGES = ["/login", "/verify", "/project-selection"];

// MAIN APP COMPONENT

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Read persisted theme on first mount
  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  // Sync theme class + localStorage whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  // Prevent SSR/hydration mismatch
  if (!mounted) return null;

  const isDark = theme === "dark";
  const isAuthPage = AUTH_PAGES.includes(router.pathname);

  // Auth pages render standalone — no sidebar
  if (isAuthPage) {
    return (
      <div className={isDark ? "dark" : ""}>
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex font-sans transition-colors duration-200 relative overflow-hidden ${
        isDark ? "bg-black text-white" : "bg-[#F7F8FA] text-[#101828]"
      }`}
    >
      {/* Ambient Glow Orbs */}
      {isDark && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/[0.08] rounded-full blur-[120px] pointer-events-none" />
        </>
      )}
      <Sidebar
        router={router}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <CursorLoader />
        <div className="flex-1">
          <Component {...pageProps} theme={theme} isDark={isDark} />
        </div>
      </main>
    </div>
  );
}