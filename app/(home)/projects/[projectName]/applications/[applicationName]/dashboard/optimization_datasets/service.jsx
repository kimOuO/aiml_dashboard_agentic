import { useEffect, useState } from "react";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchDatasets = (
  applicationUID,
  activeTab,
  searchQuery,
  currentPage
) => {
  const [optimiDatasets, setOptimiDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  useEffect(() => {
    const fetchOptimiDatasets = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (applicationUID && activeTab) {
        const response = await testAPI("getOptimiDatasets", {
          uid: applicationUID,
          activeTab,
        });
        if (response && response.data) {
          setOptimiDatasets(response.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching datasets:", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchOptimiDatasets();
  }, [applicationUID, activeTab, searchQuery, currentPage, fetchTrigger]);
  return {
    optimiDatasets,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//更新OptimiDataset
export const useUpdateDataset = (datasetUID, formData) => {
  const updateOptimiDataset = async () => {
    if (datasetUID) {
      const response = await testAPI("updateOptimiDataset", {
        uid: datasetUID,
        ...formData,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating dataset:", response.message);
      }
    }
  };
  return { updateOptimiDataset };
};

//刪除OptimiDataset
export const useDeleteDataset = (datasetUID) => {
  const deleteOptimiDataset = async () => {
    if (datasetUID) {
      const response = await testAPI("deleteOptimiDataset", {
        uid: datasetUID,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting dataset:", response.message);
      }
    }
  };
  return { deleteOptimiDataset };
};

//創建OptimiDataset
export const useCreateDataset = () => {
  const createOptimiDataset = async (formData) => {
    if (formData) {
      const response = await testAPI("createOptimiDataset", formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating dataset:", response.message);
      }
    }
  };
  return { createOptimiDataset };
};

export const HandleUpdate = async (datasetUID, formData, onEdit, onClose) => {
  const { updateOptimiDataset } = useUpdateDataset(datasetUID, formData);
  const response = await updateOptimiDataset();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (datasetUID, onDelete, onClose) => {
  const { deleteOptimiDataset } = useDeleteDataset(datasetUID);
  const response = await deleteOptimiDataset();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createOptimiDataset } = useCreateDataset();
  const response = await createOptimiDataset(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};
