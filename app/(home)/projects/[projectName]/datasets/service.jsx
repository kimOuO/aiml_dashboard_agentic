import { useEffect, useState } from "react";
import { testAPI } from "@/app/api/entrypoint";

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
    const fetchDatasets = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (projectUID && activeTab) {
        const response = await testAPI("getDatasets", {
          uid: projectUID,
          activeTab,
        });
        if (response && response.data) {
          setDatasets(response.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching datasets:", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchDatasets();
  }, [projectUID, activeTab, searchQuery, currentPage, fetchTrigger]);
  return {
    dataset,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//更新dataset
export const useUpdateDataset = (datasetUID, formData) => {
  const updateDataset = async () => {
    if (datasetUID) {
      const response = await testAPI("updateDataset", {
        uid: datasetUID,
        ...formData,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating dataset：", response.message);
      }
    }
  };
  return { updateDataset };
};

//刪除dataset
export const useDeleteDataset = (datasetUID) => {
  const deleteDataset = async () => {
    if (datasetUID) {
      const response = await testAPI("deleteDataset", { uid: datasetUID });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting dataset：", response.message);
      }
    }
  };
  return { deleteDataset };
};

//創建dataset
export const useCreateDataset = () => {
  const createDataset = async (formData) => {
    console.log("Creating dataset with data:", formData);
    if (formData) {
      const response = await testAPI("createDataset", formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating dataset:", response.message);
      }
    }
  };
  return { createDataset };
};

export const HandleUpdate = async (datasetUID, formData, onEdit, onClose) => {
  const { updateDataset } = useUpdateDataset(datasetUID, formData);
  const response = await updateDataset();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (datasetUID, onDelete, onClose) => {
  const { deleteDataset } = useDeleteDataset(datasetUID);
  const response = await deleteDataset();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createDataset } = useCreateDataset();
  const response = await createDataset(formData);
  console.log(response);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};
