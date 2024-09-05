"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 檢查 localStorage 是否存在 "isLoggedIn" 鍵
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/login"); // 如果未登入，重定向到登入頁面
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isLoggedIn", "true"); // 登入後設定 "isLoggedIn" 鍵
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn"); // 登出時移除 "isLoggedIn" 鍵
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
