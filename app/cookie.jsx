"use client";
import { Cookies } from "react-cookie";


const getCookieValue = (key, force_logout = false) => {
  const cookies = new Cookies();
  if (cookies.get(key) === undefined) {
    if (force_logout) window.location.href = "/";
    else return;
  } else return cookies.get(key);
};

const setCookieValue = (
  key,
  value,
  maxAge
) => {
  const cookies = new Cookies();
  cookies.set(key, value, { maxAge: maxAge });
};

const getLocalStorageData = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
};

const setLocalStorageData = (key, value ) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageData = (key)  => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

const clearAllCookie = () => {
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
