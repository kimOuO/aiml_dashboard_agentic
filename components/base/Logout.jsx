"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { clearAllCookie } from "@/app/cookie";
import { PROTOCAL, HOST, API_PORT } from "@/app/api/entrypoint";

const API_BASE_URL = `${PROTOCAL}://${HOST}${API_PORT}`;
const Logout = ({ accountInfo }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem("new_avatar_url");
    const url =
      storedAvatarUrl === null
        ? `${API_BASE_URL}${accountInfo?.account_avatar}`
        : `${API_BASE_URL}${storedAvatarUrl}`;
    setAvatarUrl(url);
  }, [accountInfo]);

  if (!avatarUrl) return <div>Loading...</div>;

  return (
    <>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="flex item-center justify-center rounded-lg py-2 px-4 text-sm font-semibold leading-6 text-gray-900">
          <div className="mx-2">
            <Image
              className="border-1 rounded-full"
              width={40}
              height={40}
              src=""
              alt="User Avatar"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="mx-2">Hi, test</div>
          <a
            className="rounded hover:bg-gray-200 mx-2"
            href="/"
            onClick={() => {
              clearAllCookie;
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
