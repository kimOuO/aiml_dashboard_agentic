"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../api/entrypoint";
import { getCookieValue, setCookieValue } from "../../cookie";

const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME;

export const useAuth = () => {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const authToken = getCookieValue(ACCESS_TOKEN_NAME);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // const res = await login({
    //   account_name: accountName,
    //   password: password,
    //   remember: remember,
    // });

    // if (res.status === 200) {
    //   setError(null);
    //   setCookieValue(
    //     ACCESS_TOKEN_NAME,
    //     res.data.data["access"],
    //     remember ? res.data["max_age"] : null
    //   );
    //   setCookieValue("remember", remember, res.data["max_age"]);
    //   router.push("/projects");
    // } else {
    //   setError(res.response?.data["message"]);
    //   setIsSubmitting(false);
    // }
    router.push("/projects");
  };

  useEffect(() => {
    if (authToken && getCookieValue("remember", false) === true) {
      router.push("/projects");
    }
  }, [authToken, router]);

  return {
    accountName,
    setAccountName,
    password,
    setPassword,
    remember,
    setRemember,
    error,
    isSubmitting,
    submit,
  };
};
