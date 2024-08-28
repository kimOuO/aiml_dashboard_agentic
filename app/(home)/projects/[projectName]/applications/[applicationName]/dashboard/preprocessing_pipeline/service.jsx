"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

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
        //PipelineMetadataWriter/filter_by_application
        const data = { f_application_uid: applicationUID };
        const response = await getAPI("VytZbpzyI9fFWkM6", data);
        if (response.status === 200) {
          //根據type過濾pipelines
          const filteredPipelines = response.data.data.filter(
            (pipeline) => pipeline.type === type
          );
          setPipelines(filteredPipelines);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipeline：", response.data);
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
      //PipelineMetadataWriter/create
      const response = await getAPI("FgdSO4ryg2UA2APl", formData, true);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating pipeline:", response.data);
      }
    }
  };
  return { createPipeline };
};

//更新pipeline
export const useUpdatePipeline = (formData) => {
  const updatePipeline = async () => {
    if (formData) {
      //PipelineMetadataWriter/update
      const response = await getAPI("28a9H19Khaw4KIbV", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating pipeline：", response.data);
      }
    }
  };
  return { updatePipeline };
};

//刪除pipeline
export const useDeletePipeline = (pipelineUID) => {
  const deletePipeline = async () => {
    if (pipelineUID) {
      //PipelineMetadataWriter/delete
      const data = { uid: pipelineUID };
      const response = await getAPI("8PSWYHbJF2ZHuXVP", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting pipeline：", response.data);
      }
    }
  };
  return { deletePipeline };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updatePipeline } = useUpdatePipeline(formData);
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
