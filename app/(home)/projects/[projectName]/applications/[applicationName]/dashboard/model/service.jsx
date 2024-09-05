"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchModels = (applicationUID) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (applicationUID) {
        //ModelMetadataWriter/filter_by_application
        const data = { f_application_uid: applicationUID };
        const response = await getAPI("EU2X3oWVHQiEoYBi", data);
        if (response.status === 200) {
          setModels(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching models：", response.data);
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

//創建model
export const useCreateModel = () => {
  const createModel = async (formData) => {
    if (formData) {
      //ModelMetadataWriter/create
      const response = await getAPI("OBF4f9guOmzitGvC", formData, true);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating model:", response.data);
      }
    }
  };
  return { createModel };
};

//更新model
export const useUpdateModel = (formData) => {
  const updateModel = async () => {
    if (formData) {
      //ModelMetadataWriter/update
      const response = await getAPI("3bfcpDzw20XiCGn1", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating model:", response.data);
      }
    }
  };
  return { updateModel };
};

//刪除modal
export const useDeleteModel = (modelUID) => {
  const deleteModel = async () => {
    if (modelUID) {
      //ModelMetadataWriter/delete
      const data = { uid: modelUID };
      const response = await getAPI("8qFsmTELrN0lag20", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting model:", response.data);
      }
    }
  };
  return { deleteModel };
};

//上傳inference modal
export const useUploadInferenceModal = () => {
  const uploadInference = async (formData) => {
    if (formData) {
      const response = await getAPI("Zd1B3anLLSb2f59h", formData, true);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error upload inference file:", response.data);
      }
    }
  };
  return { uploadInference };
};

export const HandleUpload = async (formData, onUpload, onClose) => {
  const { uploadInference } = useUploadInferenceModal();
  const response = await uploadInference(formData);
  if (response && !(response instanceof Error)) {
    onUpload();
    onClose();
  }
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateModel } = useUpdateModel(formData);
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

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createModel } = useCreateModel();
  const response = await createModel(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};

export const HandlePublishToggle = async (model, originalStatus) => {
  const newStatus = originalStatus ? "unpublish" : "publish";
  const data = {
    uid: model.uid,
    name: model.name,
    description: model.description,
    model_input_format: model.model_input_format,
    model_output_format: model.model_output_format,
    status: newStatus,
  };
  const { updateModel } = useUpdateModel(data);
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
