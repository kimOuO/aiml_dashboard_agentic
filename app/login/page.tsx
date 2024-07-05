"use client";

import React, { useState, useEffect } from "react";
import { login } from "../api/entrypoint";
import { getCookieValue, setCookieValue } from "../cookie";
import { Button } from "@/components/ui/button";
function LoginPage() {
  const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME;
  const authToken = getCookieValue(ACCESS_TOKEN_NAME);
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    console.log(accountName, password);
    e.preventDefault();
    setIsSubmitting(true);

    const res = await login({
      account_name: accountName,
      password: password,
      remember: remember,
    });

    if (res.status === 200) {
      setError(null);
      setCookieValue(
        ACCESS_TOKEN_NAME,
        res.data.data["access"],
        remember ? res.data["max_age"] : null
      );
      setCookieValue("remember", remember, res.data["max_age"]);
      window.location.href = "/projects";
    } else {
      setError(res.response?.data["message"]);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (authToken && getCookieValue("remember", false) === true) {
      window.location.href = "/projects";
    }
  }, [authToken]);

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 overflow-y-auto">
      <div className="w-full max-w-md p-8 space-y-3 bg-white shadow-lg rounded-xl">
        <div className="mb-10">
          <div className="flex justify-start">
            <div>
              <img
                src="./mitlab_logo_black.png"
                className="h-20 w-20 mx-auto "
              ></img>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center">Login</h1>
        </div>
        <form onSubmit={(e) => submit(e)} className="space-y-4">
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

          <div className="-ml-2.5">
            <div className="inline-flex items-center">
              <label
                htmlFor="checkbox"
                className="relative flex items-center p-3 rounded-full cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                  id="checkbox"
                />
                <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
              <label
                className="mt-px font-light text-gray-700 cursor-pointer select-none"
                htmlFor="checkbox"
              >
                Remember Me
              </label>
            </div>
          </div>
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
          <Button type="submit" onClick={submit} disabled={isSubmitting}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
