"use client";
import { Cookies } from "react-cookie";

type CookieKey = string;
type CookieValue = string;
type MaxAge = number | undefined;

const getCookieValue = (key: CookieKey, force_logout = false) => {
  const cookies = new Cookies();
  if (cookies.get(key) === undefined) {
    if (force_logout) window.location.href = "/";
    else return;
  } else return cookies.get(key);
};

const setCookieValue = (
  key: CookieKey,
  value: CookieValue,
  maxAge?: MaxAge
): void => {
  // 修改這裡
  const cookies = new Cookies();
  cookies.set(key, value, { maxAge: maxAge });
};

const getLocalStorageData = (key: CookieKey): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};

const setLocalStorageData = (key: CookieKey, value: CookieValue): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageData = (key: CookieKey): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

const clearAllCookie = (): void => {
  const cookies = new Cookies();
  const cookieKeys = Object.keys(cookies.getAll());
  cookieKeys.forEach((cookieKey) => cookies.remove(cookieKey));
};

export {
  getCookieValue,
  setCookieValue,
  getLocalStorageData,
  setLocalStorageData,
  removeLocalStorageData,
  clearAllCookie,
};
