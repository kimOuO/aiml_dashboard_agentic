"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchModels = (applicationUID) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (applicationUID) {
        const response = await testAPI("getModels", { uid: applicationUID });
        if (response && response.data) {
          setModels(response.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching models：", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchModels();
  }, [applicationUID, fetchTrigger]);
  return {
    models,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//更新model
export const useUpdateModel = (modelUID, formData) => {
  const updateModel = async () => {
    if (modelUID) {
      const response = await testAPI("updateModel", {
        uid: modelUID,
        ...formData,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating model:", response.message);
      }
    }
  };
  return { updateModel };
};

//刪除model
export const useDeleteModel = (modelUID) => {
  const deleteModel = async () => {
    if (modelUID) {
      const response = await testAPI("deleteModel", { uid: modelUID });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting model:", response.message);
      }
    }
  };
  return { deleteModel };
};

export const HandleUpdate = async (modelUID, formData, onEdit, onClose) => {
  const { updateModel } = useUpdateModel(modelUID, formData);
  const response = await updateModel();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (modelUID, onDelete, onClose) => {
  const { deleteModel } = useDeleteModel(modelUID);
  const response = await deleteModel();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandlePublishToggle = async (modelUID, originalStatus) => {
  const newStatus = originalStatus ? "unpublish" : "publish";
  // 使用 useUpdateModel 進行更新
  const { updateModel } = useUpdateModel(modelUID, { status: newStatus });
  const response = await updateModel();
  if (response && !(response instanceof Error)) {
    return response;
  }
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  applicationUID
) => {
  const router = useRouter();

  const handlePreprocessingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline?applicationUID=${applicationUID}`
    );
  };

  return { handlePreprocessingPipelineClick, handleTrainingPipelineClick };
};
