"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SENDBOX_TEST_USERS, type SendboxRole, type SendboxTestUser } from "@/platform/auth/sendbox-mock-auth";

interface SendboxAuthContextValue {
  user: SendboxTestUser | null;
  isReady: boolean;
  isAuthorized: boolean;
  isReadOnly: boolean;
  login: (role: SendboxRole) => void;
  logout: () => void;
}

const SendboxAuthContext = createContext<SendboxAuthContextValue>({
  user: null,
  isReady: false,
  isAuthorized: false,
  isReadOnly: false,
  login: () => {},
  logout: () => {},
});

export function useSendboxAuth() {
  return useContext(SendboxAuthContext);
}

const STORAGE_KEY = "sendbox_test_role";

export function SendboxAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SendboxTestUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const found = SENDBOX_TEST_USERS.find((u) => u.role === stored);
        if (found) setUser(found);
      }
    } catch {
      /* ignore */
    }
    setIsReady(true);
  }, []);

  const login = useCallback((role: SendboxRole) => {
    const found = SENDBOX_TEST_USERS.find((u) => u.role === role);
    if (found) {
      setUser(found);
      try {
        sessionStorage.setItem(STORAGE_KEY, role);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const isReadOnly = user?.role === "reader";

  return (
    <SendboxAuthContext.Provider
      value={{
        user,
        isReady,
        isAuthorized: !!user,
        isReadOnly,
        login,
        logout,
      }}
    >
      {children}
    </SendboxAuthContext.Provider>
  );
}