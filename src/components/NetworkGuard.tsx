"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * NetworkGuard watches online/offline events and routes users to a dedicated
 * offline page when the app is offline. When connectivity returns, users are
 * redirected back to their last online path.
 */
export function NetworkGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const lastOnlinePathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const OFFLINE_ROUTE = "/offline";

    const goOffline = () => {
      try {
        if (pathname !== OFFLINE_ROUTE) {
          lastOnlinePathRef.current = pathname;
          sessionStorage.setItem("lastOnlinePath", pathname);
          router.replace(OFFLINE_ROUTE);
        }
      } catch {
        // ignore
      }
    };

    const goOnline = () => {
      const last = sessionStorage.getItem("lastOnlinePath") || lastOnlinePathRef.current || "/";
      if (pathname === OFFLINE_ROUTE) {
        router.replace(last);
      }
    };

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      goOffline();
    }

    const onOffline = () => goOffline();
    const onOnline = () => goOnline();

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [pathname, router]);

  return children;
}
