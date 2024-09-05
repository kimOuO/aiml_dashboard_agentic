"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { clearAllCookie } from "@/app/cookie";
import { PROTOCAL, HOST, API_PORT } from "@/app/api/entrypoint";

const API_BASE_URL = `${PROTOCAL}://${HOST}${API_PORT}`;
const Logout = ({ accountInfo }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [accountName, setAccountName] = useState("");
  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem("new_avatar_url");
    const url =
      storedAvatarUrl === null
        ? `${API_BASE_URL}${accountInfo?.account_avatar}`
        : `${API_BASE_URL}${storedAvatarUrl}`;
    setAvatarUrl(url);

    // 從 localStorage 獲取 accountName
    const storedAccountName = localStorage.getItem("accountname");
    if (storedAccountName) {
      setAccountName(storedAccountName);
    }
  }, [accountInfo]);

  if (!avatarUrl) return <div>Loading...</div>;

  return (
    <>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="flex items-center justify-center rounded-lg py-2 px-4 text-sm font-semibold leading-6 text-gray-900">
          {/* 使用 state 中的 accountName 來顯示用戶名 */}
          <div className="mx-2">Hi, {accountName || "Guest"}</div>
          <a
            className="rounded hover:bg-gray-200 mx-2"
            href="/"
            onClick={() => {
              localStorage.clear();
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </>
  );
};
export default Logout;
