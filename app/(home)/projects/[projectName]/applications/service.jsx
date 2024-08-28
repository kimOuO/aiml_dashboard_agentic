"use client";

import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";

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
        const response = await getAPI("A19MSnNoF8p36XHn", data);
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
//尚未測試成功
export const useUpdateApplication = (formData) => {
  const updateApplication = async () => {
    if (formData) {
      //ApplicationMetadataWriter/update
      const response = await getAPI("I5saSl6jjFMJJqKr", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating application：", response.data);
      }
    }
  };
  return { updateApplication };
};

//刪除application
export const useDeleteApplication = (applicationUID) => {
  const deleteApplication = async () => {
    if (applicationUID) {
      //ApplicationMetadataWriter/delete
      const data = { uid: applicationUID };
      const response = await getAPI("z1gRhCXJskWRpxG1", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting application：", response.data);
      }
    }
  };
  return { deleteApplication };
};

//創建application
export const useCreateApplication = () => {
  const createApplication = async (formData) => {
    if (formData) {
      //ApplicationMetadataWriter/create
      const response = await getAPI("ah3Q2A5rTQrER68p", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating application:", response.data);
      }
    }
  };
  return { createApplication };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateApplication } = useUpdateApplication(formData);
  const response = await updateApplication();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (applicationUID, onDelete, onClose) => {
  const { deleteApplication } = useDeleteApplication(applicationUID);
  const response = await deleteApplication();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createApplication } = useCreateApplication();
  const response = await createApplication(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};
