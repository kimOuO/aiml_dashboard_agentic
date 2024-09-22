"use client";

import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchApplications = (projectUID) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (projectUID) {
        //ApplicationMetadataWriter/filter_by_project
        const data = { f_project_uid: projectUID };
        const response = await getAPI(
          APIKEYS.FILTER_APPLICATION_BY_PROJECT,
          data
        );
        if (response.status === 200) {
          setApplications(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching applications:", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [projectUID, fetchTrigger]);

  return {
    applications,
    isLoading,
    // 用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//更新application
export const useUpdateApplication = (formData) => {
  const updateApplication = async () => {
    if (formData) {
      //ApplicationMessenger/update
      const response = await getAPI(
        APIKEYS.UPDATE_APPLICATION_MESSENGER,
        formData
      );
      if (response) return response;
    }
  };
  return { updateApplication };
};

//刪除application
export const useDeleteApplication = (applicationUID) => {
  const deleteApplication = async () => {
    if (applicationUID) {
      //ApplicationTopicManager/delete
      const data = { application_uid: applicationUID };
      const response = await getAPI(APIKEYS.DELETE_APPLICATION_TOPIC, data);
      if (response) return response;
    }
  };
  return { deleteApplication };
};

//創建application
export const useCreateApplication = () => {
  const createApplication = async (formData) => {
    if (formData) {
      //ApplicationTopicManager/create
      const response = await getAPI(APIKEYS.CREATE_APPLICATION_TOPIC, formData);
      if (response) return response;
    }
  };
  return { createApplication };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateApplication } = useUpdateApplication(formData);
  const response = await updateApplication();
  if (response.status === 200) {
    onEdit();
    onClose();
  }
  return response;
};

export const HandleDelete = async (applicationUID, onDelete, onClose) => {
  const { deleteApplication } = useDeleteApplication(applicationUID);
  const response = await deleteApplication();
  if (response.status === 200) {
    onDelete();
    onClose();
  }
  return response;
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createApplication } = useCreateApplication();
  const response = await createApplication(formData);
  if (response.status === 200) {
    onCreate();
    onClose();
  }
  return response;
};
