"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type Platform =
  | "ios" // Safari iOS - fallback manual "Add to Home Screen"
  | "chromium" // Chrome/Edge/Chromium desktop atau Android - support native prompt
  | "firefox-desktop" // Firefox desktop - PWA install tidak didukung sama sekali
  | "safari-desktop" // Safari desktop (macOS) - tidak didukung
  | "unsupported"; // fallback umum

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>("unsupported");

  useEffect(() => {
    const checkInstalled = () => {
      const standaloneMedia = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const iosStandalone =
        (window.navigator as unknown as { standalone?: boolean })
          .standalone === true;
      setIsInstalled(standaloneMedia || iosStandalone);
    };

    checkInstalled();

    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    const isFirefox = /Firefox/i.test(ua);
    // Safari asli (bukan Chrome/Edge/Firefox yang UA-nya juga mengandung "Safari")
    const isSafari =
      /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    let detectedPlatform: Platform;
    if (isIOS) {
      detectedPlatform = "ios";
    } else if (isFirefox) {
      detectedPlatform = "firefox-desktop";
    } else if (isSafari && !isAndroid) {
      detectedPlatform = "safari-desktop";
    } else {
      // Chrome, Edge, Opera, Brave, dan browser Chromium lain (desktop maupun Android)
      detectedPlatform = "chromium";
    }
    setPlatform(detectedPlatform);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    const mql = window.matchMedia("(display-mode: standalone)");
    mql.addEventListener?.("change", checkInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mql.removeEventListener?.("change", checkInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return { outcome: "unavailable" as const };
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice;
  }, [deferredPrompt]);

  return {
    isInstalled,
    platform,
    canPromptNatively: deferredPrompt !== null,
    promptInstall,
  };
}