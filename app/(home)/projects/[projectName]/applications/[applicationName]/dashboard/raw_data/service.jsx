"use client";

import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchRawData = (applicationUID, organizationUID) => {
  const [rawData, setRawData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchRawData = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (applicationUID) {
        //PipelineMetadataWriter/filter_by_application
        const data = { f_application_uid: applicationUID };
        const response = await getAPI(
          APIKEYS.FILTER_RAWDATA_BY_APPLICATION,
          data
        );
        if (response.status === 200) {
          setRawData(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching raw data:", response.data);
        }
        setIsLoading(false);
      }
    };

    const fetchAgents = async () => {
      if (organizationUID) {
        //AgentMetadataWriter/filter_by_organization
        const data = { f_organization_uid: organizationUID };
        const response = await getAPI(
          APIKEYS.FILTER_AGENT_BY_ORGANIZATION,
          data
        );
        if (response.status === 200) {
          setAgents(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching agents:", response.data);
        }
      }
    };

    const fetchModels = async () => {
      if (applicationUID) {
        //ModelMetadataWriter/filter_by_application
        const data = { f_application_uid: applicationUID };
        const response = await getAPI(
          APIKEYS.FILTER_MODEL_BY_APPLICATION,
          data
        );
        if (response.status === 200) {
          setModels(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching models:", response.data);
        }
      }
    };

    fetchModels();
    fetchAgents();
    fetchRawData();
  }, [applicationUID, fetchTrigger]);

  return {
    rawData,
    agents,
    models,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//更新RawData
export const useUpdateRawData = (formData) => {
  const updateRawData = async () => {
    if (formData) {
      //RawDataMetadataWriter/update
      const response = await getAPI(
        APIKEYS.UPDATE_RAWDATA_METADATA,
        formData,
        true
      );
      if (response) return response;
    }
  };
  return { updateRawData };
};

//刪除RawData
export const useDeleteRawData = (datasetUID) => {
  const deleteRawData = async () => {
    if (datasetUID) {
      //RawDataMetadataWriter/delete
      const data = { uid: datasetUID };
      const response = await getAPI(
        APIKEYS.DELETE_RAWDATA_METADATA,
        data
      );
      if (response) return response;
    }
  };
  return { deleteRawData };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateRawData } = useUpdateRawData(formData);
  const response = await updateRawData();
  if (response.status === 200) {
    onEdit();
    onClose();
  }
  return response;
};

export const HandleDelete = async (modelUID, onDelete, onClose) => {
  const { deleteRawData } = useDeleteRawData(modelUID);
  const response = await deleteRawData();
  if (response.status === 200) {
    onDelete();
    onClose();
  }
  return response;
};
