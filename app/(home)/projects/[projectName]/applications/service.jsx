"use client";

import { useEffect, useState } from "react";
import { deleteTestAPI, getTestAPI, putTestAPI } from "@/app/api/entrypoint";

export const useFetchApplications = (projectUID) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (projectUID) {
      const fetchApplications = async () => {
        //開始抓取資料，畫面顯示loading
        const response = await getTestAPI(`applications`, { projectUID });
        if (response && response.data) {
          setApplications(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error("Error fetching applications:", response.message);
        }
      };

      fetchApplications();
    }
  }, [projectUID, fetchTrigger]);

  return {
    applications,
    isLoading,
    // 用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};
//更新application
export const useUpdateApplication = (applicationUID, formData) => {
  const updateApplication = async () => {
    if (applicationUID) {
      const response = await putTestAPI(
        `applications/${applicationUID}`,
        formData
      );
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating application：", response.message);
      }
    }
  };
  return { updateApplication };
};
//刪除application
export const useDeleteApplication = (applicationUID) => {
  const deleteApplication = async () => {
    if (applicationUID) {
      const response = await deleteTestAPI(`applications/${applicationUID}`);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting application：", response.message);
      }
    }
  };
  return { deleteApplication };
};

export const handleUpdate = async (
  applicationUID,
  formData,
  onEdit,
  onClose
) => {
  const { updateApplication } = useUpdateApplication(applicationUID, formData);
  const response = await updateApplication();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const handleDelete = async (applicationUID, onDelete, onClose) => {
  const { deleteApplication } = useDeleteApplication(applicationUID);
  const response = await deleteApplication();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};
