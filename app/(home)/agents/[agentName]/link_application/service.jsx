"use client";

import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchAgentApplications = (agentUID) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (agentUID) {
        //ApplicationPermissionManager/retrieve
        const data = { f_agent_uid: agentUID };
        const response = await getAPI(
          APIKEYS.RETRIEVE_APPLICATION_PERMISSION,
          data
        );
        if (response.status === 200) {
          setApplications(response.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching applications:", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [agentUID, fetchTrigger]);

  return {
    applications,
    isLoading,
    // 用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

export const HandlePublishToggle = async (
  applicationUID,
  agentUID,
  isPublish
) => {
  const endpoint = isPublish
    ? APIKEYS.DELETE_APPLICATION_PERMISSION // ApplicationPermissionManager/delete
    : APIKEYS.CREATE_APPLICATION_PERMISSION; // ApplicationPermissionManager/create

  try {
    const response = await getAPI(endpoint, {
      uid: applicationUID,
      f_agent_uid: agentUID,
    });
    if (response.status === 200) {
      return response.data;
    } else if (response && response instanceof Error) {
      console.error("Error deleting application：", response.data);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in HandlePublishToggle:", error);
    return null;
  }
};
