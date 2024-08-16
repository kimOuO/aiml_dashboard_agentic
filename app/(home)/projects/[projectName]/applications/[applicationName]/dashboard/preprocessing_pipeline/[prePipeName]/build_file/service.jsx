"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchBuildFiles = (pipelineUID, type) => {
  const [buildFiles, setBuildFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchBuildFiles = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID) {
        const response = await testAPI("getBuildFiles", { uid: pipelineUID });
        if (response && response.data) {
          setBuildFiles(response.data);
        } else if (response && response instanceof Error) {
          console.log("Error fetching build files：", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchBuildFiles();
  }, [pipelineUID, fetchTrigger]);
  return {
    buildFiles,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//創建buildFile
export const useCreateBuildFile = () => {
  const createBuildFile = async (formData) => {
    if (formData) {
      const response = await testAPI("createBuildFile", formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating build file:", response.message);
      }
    }
  };
  return { createBuildFile };
};

//更新buildFile
export const useUpdateBuildFile = (buildFileUID, formData) => {
  const updateBuildFile = async () => {
    if (buildFileUID) {
      const response = await testAPI("updateBuildFile", {
        uid: buildFileUID,
        ...formData,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating pipeline：", response.message);
      }
    }
  };
  return { updateBuildFile };
};

//刪除buildFile
export const useDeleteBuildFile = (buildFileUID) => {
  const deleteBuildFile = async () => {
    if (buildFileUID) {
      const response = await testAPI("deleteBuildFile", { uid: buildFileUID });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting build file", response.message);
      }
    }
  };
  return { deleteBuildFile };
};

export const HandleUpdate = async (buildFileUID, formData, onEdit, onClose) => {
  const { updateBuildFile } = useUpdateBuildFile(buildFileUID, formData);
  const response = await updateBuildFile();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (buildFileUID, onDelete, onClose) => {
  const { deleteBuildFile } = useDeleteBuildFile(buildFileUID);
  const response = await deleteBuildFile();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createBuildFile } = useCreateBuildFile();
  const response = await createBuildFile(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/config?pipelineUID=${pipelineUID}`
    );
  };
  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  return { handleConfigClick, handleTasksClick };
};
