"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchConfigs = (pipelineUID) => {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID) {
        //ConfigMetadataWriter/filter_by_pipeline
        const data = { f_pipeline_uid: pipelineUID };
        const response = await getAPI(APIKEYS.FILTER_CONFIG_BY_PIPELINE, data);
        if (response.status === 200) {
          setConfigs(response.data.data);
        } else if (response && response instanceof Error) {
          console.log("Error fetching config：", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchConfigs();
  }, [pipelineUID, fetchTrigger]);
  return {
    configs,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

const useFindApplicationUID = (pipelineUID) => {
  const [applicationUID, setApplicationUID] = useState(null);
  useEffect(() => {
    const fetchApplicationUID = async () => {
      if (pipelineUID) {
        //PipelineMetadataWriter/retrieve
        const data = { uid: pipelineUID };
        const response = await getAPI(APIKEYS.RETRIEVE_PIPELINE_METADATA, data);
        if (response.status === 200) {
          setApplicationUID(response.data.f_application_uid);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipeline：", response.data);
        }
      }
    };
    fetchApplicationUID();
  }, [pipelineUID]);
  return { applicationUID };
};

//創建config
export const useCreateConfig = () => {
  const createConfig = async (formData) => {
    if (formData) {
      //ConfigMetadataWriter/create
      const response = await getAPI(APIKEYS.CREATE_CONFIG_METADATA, formData);
      if (response) return response;
    }
  };
  return { createConfig };
};

//更新config
export const useUpdateConfig = (formData) => {
  const updateConfig = async () => {
    if (formData) {
      //ConfigMetadataWriter/update
      const response = await getAPI(APIKEYS.UPDATE_CONFIG_METADATA, formData);
      if (response) return response;
    }
  };
  return { updateConfig };
};

//刪除config
export const useDeleteConfig = (configUID) => {
  const deleteConfig = async () => {
    if (configUID) {
      //ConfigMetadataWriter/delete
      const data = { uid: configUID };
      const response = await getAPI(APIKEYS.DELETE_CONFIG_METADATA, data);
      if (response) return response;
    }
  };
  return { deleteConfig };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateConfig } = useUpdateConfig(formData);
  const response = await updateConfig();
  if (response.status === 200) {
    onEdit();
    onClose();
  }
  return response;
};

export const HandleDelete = async (configUID, onDelete, onClose) => {
  const { deleteConfig } = useDeleteConfig(configUID);
  const response = await deleteConfig();
  if (response.status === 200) {
    onDelete();
    onClose();
  }
  return response;
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createConfig } = useCreateConfig();
  const response = await createConfig(formData);
  if (response.status === 200) {
    onCreate();
    onClose();
  }
  return response;
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const { applicationUID } = useFindApplicationUID(pipelineUID);

  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  return {
    handleTasksClick,
    handleBuildFileClick,
  };
};
