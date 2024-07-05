"use client";

import axios from "axios";
import { getCookieValue } from "../cookie";

// API
const PROTOCAL = process.env.PROTOCAL;
const HOST = process.env.HOST;
const API_PORT = process.env.API_PORT ? `:${process.env.API_PORT}` : "";
const API_ROOT = process.env.API_ROOT;
const API_VERSION = "v0.1";
const API_TYPE = "entrypoint";

// Authorization
const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME;
const AUTH_HEADER_TYPE = process.env.AUTH_HEADER_TYPE;

const API = `${PROTOCAL}://${HOST}${API_PORT}/${API_ROOT}/${API_VERSION}/${API_TYPE}`;

// ------------------------------------- API -------------------------------------

const checkOrganization = async (data) => {
  const API_ACTOR = "AccountValidator";
  const API_FUNCTION = "check_organization";
  try {
    return await axios.post(`${API}/${API_ACTOR}/${API_FUNCTION}`, data);
  } catch (error) {
    return error;
  }
};

const listRole = async () => {
  const API_ACTOR = "RoleMetadataWriter";
  const API_FUNCTION = "list";
  try {
    return await axios.get(`${API}/${API_ACTOR}/${API_FUNCTION}`);
  } catch (error) {
    return error;
  }
};

const login = async (data: JSON) => {
  console.log("測試")
  const API_ACTOR = "AccountValidator";
  const API_FUNCTION = "login";
  try {
    return await axios.post(`${API}/${API_ACTOR}/${API_FUNCTION}`, data);
  } catch (error) {
    return error;
  }
};

const signup = async (data: JSON) => {
  const API_ACTOR = "AccountValidator";
  const API_FUNCTION = "signup";
  try {
    return await axios.post(`${API}/${API_ACTOR}/${API_FUNCTION}`, data);
  } catch (error) {
    return error;
  }
};

const getAPI = async (
  api_key: string,
  data: any,
  is_upload: boolean = false,
  is_download: boolean = false
) => {
  const API_ACTOR = "Router";
  const API_FUNCTION = "parse";
  const headers = { Authorization: `${getCookieValue(ACCESS_TOKEN_NAME)}` };

  const responseType = is_download ? "blob" : "json";

  if (is_upload) headers["Content-Type"] = "multipart/form-data";

  try {
    return await axios.post(`${API}/${API_ACTOR}/${API_FUNCTION}/${api_key}`, data, {
      headers: headers,
      responseType: responseType,
    });
  } catch (error) {
    return error;
  }
};

export { PROTOCAL, HOST, API_PORT, listRole, checkOrganization, getAPI, login, signup };
