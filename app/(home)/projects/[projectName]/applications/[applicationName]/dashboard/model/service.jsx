"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

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
        const response = await getAPI(
          APIKEYS.GROUP,
          data
        );
        console.log(response)
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
      const response = await getAPI(
        APIKEYS.CREATE_MODEL_METADATA,
        formData,
        true
      );
      if (response) return response;
    }
  };
  return { createModel };
};

//更新model
export const useUpdateModel = (formData) => {
  const updateModel = async () => {
    if (formData) {
      //ModelMessenger/update
      const response = await getAPI(APIKEYS.UPDATE_MODEL_MESSENGER, formData);
      if (response) return response;
    }
  };
  return { updateModel };
};

//刪除model
export const useDeleteModel = (modelUID) => {
  const deleteModel = async () => {
    if (modelUID) {
      //ModelMetadataWriter/delete
      const data = { uid: modelUID };
      const response = await getAPI(APIKEYS.DELETE_MODEL_METADATA, data);
      if (response) return response;
    }
  };
  return { deleteModel };
};

//上傳inference model
export const useUploadInferenceModel = () => {
  const uploadInference = async (formData) => {
    if (formData) {
      //InferenceMetadataWriter/create
      const response = await getAPI(
        APIKEYS.CREATE_INFERENCE_METADATA,
        formData,
        true
      );
      if (response) return response;
    }
  };
  return { uploadInference };
};

//發布model
export const usePublishModel = (formData) => {
  const publishModel = async () => {
    if (formData) {
      //ModelPermissionManager/create
      const response = await getAPI(APIKEYS.CREATE_MODEL_PERMISSION, formData);
      if (response) return response;
    }
  };
  return { publishModel };
};

//取消發布model
export const useUnpublishModel = (formData) => {
  const unpublishModel = async () => {
    if (formData) {
      //ModlPermissionManager/delete
      const response = await getAPI(APIKEYS.DELETE_MODEL_PERMISSION, formData);
      if (response) return response;
    }
  };
  return { unpublishModel };
};

//查詢inference
export const useGetInference = (modelUID) => {
  const [inference, setInference] = useState(null);
  useEffect(() => {
    const fetchInference = async () => {
      if (modelUID) {
        //InferenceMetadataWriter/filter_by_model
        const data = { f_model_uid: modelUID };
        const response = await getAPI(APIKEYS.FILTER_INFERENCE_BY_MODEL, data);
        if (response.status === 200) {
          setInference(response.data.data);
        }
      }
    };
    fetchInference();
  }, [modelUID]);
  return { inference };
};

export const HandleUpload = async (formData, onUpload, onClose) => {
  const { uploadInference } = useUploadInferenceModel();
  const response = await uploadInference(formData);
  if (response.status === 200) {
    onUpload();
    onClose();
  }
  return response;
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateModel } = useUpdateModel(formData);
  const response = await updateModel();
  if (response.status === 200) {
    onEdit();
    onClose();
  }
  return response;
};

export const HandleDelete = async (modelUID, onDelete, onClose) => {
  const { deleteModel } = useDeleteModel(modelUID);
  const response = await deleteModel();
  if (response.status === 200) {
    onDelete();
    onClose();
  }
  return response;
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createModel } = useCreateModel();
  const response = await createModel(formData);
  if (response.status === 200) {
    onCreate();
    onClose();
  }
  return response;
};

export const HandlePublishToggle = async (model, onEdit) => {
  const changeStatus = model.status === "publish" ? "unpublish" : "publish";
  const formData = {
    uid: model.uid,
    status: changeStatus,
    f_application_uid: model.f_application_uid,
  };
  if (model.status === "unpublish") {
    const { publishModel } = usePublishModel(formData);
    const response = await publishModel();
    onEdit();
    if (response.status === 200) return response;
  } else if (model.status === "publish") {
    const { unpublishModel } = useUnpublishModel(formData);
    const response = await unpublishModel();
    onEdit();
    if (response.status === 200) return response;
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
