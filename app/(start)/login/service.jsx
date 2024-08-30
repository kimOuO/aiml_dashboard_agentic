"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../api/entrypoint";
import { getCookieValue, setCookieValue } from "../../cookie";

const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME;

export const useAuth = () => {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizationUID,setOrganizationUID] = useState("")

  const router = useRouter();
  const authToken = getCookieValue(ACCESS_TOKEN_NAME);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await login({
      account_name: accountName,
      password: password,
    });

    if (response.status === 200) {
      setError(null);
      setCookieValue(ACCESS_TOKEN_NAME);
      setOrganizationUID(response.data.organization_uid)
    } else {
      setError(response.data);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (organizationUID && authToken) {
      router.push(`/projects?organizationUID=${organizationUID}`)
    }
  }, [organizationUID,authToken,router]);

  // useEffect(() => {
  //   if (authToken) {
  //     router.push("/projects");
  //   }
  // }, [authToken, router]);

  return {
    accountName,
    setAccountName,
    password,
    setPassword,
    error,
    isSubmitting,
    submit,
  };
};
