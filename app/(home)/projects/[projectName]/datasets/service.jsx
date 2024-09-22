import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchDatasets = (
  projectUID,
  activeTab,
  searchQuery,
  currentPage
) => {
  const [dataset, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  useEffect(() => {
    const fetchProjectDatasets = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (projectUID) {
        //ProjectDatasetMetadataWriter/filter_by_project
        const data = { f_project_uid: projectUID };
        const response = await getAPI(
          APIKEYS.FILTER_ROJECT_DATASET_BY_PROJECT,
          data
        );
        if (response.status === 200) {
          //根據activeTab過濾datasets
          const filteredDatasets = response.data.data.filter(
            (dataset) => dataset.type === activeTab
          );
          setDatasets(filteredDatasets);
        } else if (response && response instanceof Error) {
          console.error("Error fetching datasets:", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchProjectDatasets();
  }, [projectUID, activeTab, searchQuery, currentPage, fetchTrigger]);
  return {
    dataset,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//更新dataset
export const useUpdateDataset = (formData) => {
  const updateDataset = async () => {
    if (formData) {
      //ProjectDatasetMetadataWriter/update
      const response = await getAPI(
        APIKEYS.UPDATE_ROJECT_DATASET_METADATA,
        formData
      );
      if (response) return response;
    }
  };
  return { updateDataset };
};

//刪除dataset
export const useDeleteDataset = (datasetUID) => {
  const deleteDataset = async () => {
    if (datasetUID) {
      //ProjectDatasetMetadataWriter/delete
      const data = { uid: datasetUID };
      const response = await getAPI(
        APIKEYS.DELETE_ROJECT_DATASET_METADATA,
        data
      );
      if (response) return response;
    }
  };
  return { deleteDataset };
};

//創建dataset
export const useCreateDataset = () => {
  const createDataset = async (formData) => {
    if (formData) {
      //ProjectDatasetMetadataWriter/create
      const response = await getAPI(
        APIKEYS.CREATE_PROJECT_DATASET_METADATA,
        formData,
        true
      );
      if (response) return response;
    }
  };
  return { createDataset };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateDataset } = useUpdateDataset(formData);
  const response = await updateDataset();
  if (response.status === 200) {
    onEdit();
    onClose();
  }
  return response;
};

export const HandleDelete = async (datasetUID, onDelete, onClose) => {
  const { deleteDataset } = useDeleteDataset(datasetUID);
  const response = await deleteDataset();
  if (response.status === 200) {
    onDelete();
    onClose();
  }
  return response;
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createDataset } = useCreateDataset();
  const response = await createDataset(formData);
  if (response.status === 200) {
    onCreate();
    onClose();
  }
  return response;
};
