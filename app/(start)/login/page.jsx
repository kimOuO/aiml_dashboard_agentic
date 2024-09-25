"use client";

import React from "react";
import { useAuth } from "./service";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const {
    accountName,
    setAccountName,
    password,
    setPassword,
    error,
    isSubmitting,
    submit,
  } = useAuth();

  // 監聽 enter 鍵按下
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit(e);  // 當按下 Enter 鍵時觸發 submit
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 overflow-y-auto">
      <div className="w-full max-w-md p-8 space-y-3 bg-white shadow-lg rounded-xl">
        <div className="mb-10">
          <div className="flex justify-start">
            <div>
              <img
                src="./mitlab_logo_black.png"
                className="h-20 w-20 mx-auto"
              ></img>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center">Login</h1>
        </div>
        <form onSubmit={submit} className="space-y-4" onKeyDown={handleKeyDown}>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              placeholder=""
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500">
              Username
            </label>
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label className="after:content[''] pointer-events-none absolute left-0  -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500">
              Password
            </label>
          </div>

          {error && <small className="text-danger">{error}</small>}
        </form>
        <div className="text-center text-sm">
          Do not have an account? Contact us:{" "}
          <a
            href="mailto:mitlab.project.6g@gmail.com"
            className="text-blue-600 hover:underline"
          >
            mitlab.project.6g@gmail.com
          </a>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            onClick={submit}
            disabled={isSubmitting}
            size="custom"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}