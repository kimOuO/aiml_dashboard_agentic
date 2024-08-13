"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchPipeline = (applicationUID, type) => {
  const [pipelines, setPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchPipeline = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (applicationUID && type) {
        const response = await testAPI("getPipelines", {
          uid: applicationUID,
          type,
        });
        if (response && response.data) {
          setPipelines(response.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipeline：", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchPipeline();
  }, [applicationUID, type, fetchTrigger]);

  return {
    pipelines,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//創建pipeline
export const useCreatePipeline = () => {
  const createPipeline = async (formData) => {
    if (formData) {
      const response = await testAPI("createPipeline", formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating pipeline:", response.message);
      }
    }
  };
  return { createPipeline };
};

//更新pipeline
export const useUpdatePipeline = (pipelineUID, formData) => {
  const updatePipeline = async () => {
    if (pipelineUID) {
      const response = await testAPI("updatePipeline", {
        uid: pipelineUID,
        ...formData,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating pipeline：", response.message);
      }
    }
  };
  return { updatePipeline };
};

//刪除pipeline
export const useDeletePipeline = (pipelineUID) => {
  const deletePipeline = async () => {
    if (pipelineUID) {
      const response = await testAPI("deletePipeline", { uid: pipelineUID });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting pipeline：", response.message);
      }
    }
  };
  return { deletePipeline };
};

export const HandleUpdate = async (pipelineUID, formData, onEdit, onClose) => {
  const { updatePipeline } = useUpdatePipeline(pipelineUID, formData);
  const response = await updatePipeline();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (pipelineUID, onDelete, onClose) => {
  const { deletePipeline } = useDeletePipeline(pipelineUID);
  const response = await deletePipeline();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createPipeline } = useCreatePipeline();
  const response = await createPipeline(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  applicationUID
) => {
  const router = useRouter();

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model?applicationUID=${applicationUID}`
    );
  };

  return { handleTrainingPipelineClick, handleModelClick };
};
