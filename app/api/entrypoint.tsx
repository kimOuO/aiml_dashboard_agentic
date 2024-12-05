"use client";

import axios, { AxiosResponse } from "axios";
import { getCookieValue } from "../cookie";
import { HandHeartIcon } from "lucide-react";

// API
const PROTOCAL = process.env.PROTOCAL;
const HOST = process.env.HOST;
const API_PORT = process.env.API_PORT;
const API_ROOT = process.env.API_ROOT;
const API_VERSION = process.env.API_VERSION;
const API_TYPE = "entrypoint";

// Authorization
const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME;
const AUTH_HEADER_TYPE = process.env.AUTH_HEADER_TYPE;

const API = `${PROTOCAL}://${HOST}:${API_PORT}/${API_ROOT}/${API_VERSION}/${API_TYPE}`;

// 枚舉：定義 API 回應狀態碼
enum ApiResponseStatus {
  SUCCESS = 200,
  CLIENT_ERROR = 400,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

// ------------------------------------- API -------------------------------------

const checkOrganization = async (data: any): Promise<AxiosResponse | Error> => {
  const API_ACTOR = "AccountValidator";
  const API_FUNCTION = "check_organization";
  try {
    const response = await axios.post(
      `${API}/${API_ACTOR}/${API_FUNCTION}`,
      data
    );
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
    return error;
  }
};

const listRole = async (): Promise<AxiosResponse | Error> => {
  const API_ACTOR = "RoleMetadataWriter";
  const API_FUNCTION = "list";
  try {
    const response = await axios.get(`${API}/${API_ACTOR}/${API_FUNCTION}`);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
    return error;
  }
};

const login = async (data: JSON): Promise<AxiosResponse | Error> => {
  const API_ACTOR = "AccountValidator";
  const API_FUNCTION = "login";
  try {
    const response = await axios.post(
      `${API}/${API_ACTOR}/${API_FUNCTION}`,
      data
    );
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
    return error;
  }
};

const signup = async (data: JSON): Promise<AxiosResponse | Error> => {
  const API_ACTOR = "AccountValidator";
  const API_FUNCTION = "signup";
  try {
    const response = await axios.post(
      `${API}/${API_ACTOR}/${API_FUNCTION}`,
      data
    );
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
    return error;
  }
};

const getAPI = async (
  api_key: string,
  data: any,
  is_upload: boolean = false,
  is_download: boolean = false
): Promise<AxiosResponse | Error> => {
  const API_ACTOR = "Router";
  const API_FUNCTION = "parse";
  const accessToken = getCookieValue(ACCESS_TOKEN_NAME);

  if (!accessToken) {
    console.error("Error: Access token not found.");
    return new Error("Access token not found");
  }
  const headers = { Authorization: `${accessToken}` };

  const responseType = is_download ? "blob" : "json";
  if (is_upload) headers["Content-Type"] = "multipart/form-data";
  try {
    const response = await axios.post(
      `${API}/${API_ACTOR}/${API_FUNCTION}/${api_key}`,
      data,
      {
        headers: headers,
        responseType: responseType,
      }
    );
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
    return error;
  }
};

// 處理 API 回應
const handleApiResponse = (response: AxiosResponse): AxiosResponse | void => {
  switch (response.status) {
    case ApiResponseStatus.SUCCESS:
      return response;
    case ApiResponseStatus.CLIENT_ERROR:
      console.error("Client Error:", response.data.detail);
      break;
    case ApiResponseStatus.METHOD_NOT_ALLOWED:
      console.error("Method Not Allowed");
      break;
    case ApiResponseStatus.INTERNAL_SERVER_ERROR:
      console.error("Internal Server Error:", response.data.detail);
      break;
    default:
      console.error("Unknown Status:", response.data.detail);
  }
};

// 處理 API 錯誤
const handleApiError = (error: any) => {
  if (error.response) {
    handleApiResponse(error.response);
  } else {
    console.error("Unknown Error:", error.message);
  }
};

export {
  PROTOCAL,
  HOST,
  API_PORT,
  listRole,
  checkOrganization,
  getAPI,
  login,
  signup,
};
