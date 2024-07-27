import { useEffect, useState } from "react";
import { getTestAPI, putTestAPI, deleteTestAPI } from "@/app/api/entrypoint";

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
    setIsLoading(true);
    if (projectUID && activeTab) {
      const fetchDatasets = async () => {
        const response = await getTestAPI(`datasets`, {
          projectUID,
          activeTab,
        });
        if (response && response.data) {
          setDatasets(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error("Error fetching datasets:", response.message);
        }
      };

      fetchDatasets();
    }
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
      const response = await putTestAPI(`datasets/${datasetUID}`, formData);
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
      const response = await deleteTestAPI(`datasets/${datasetUID}`);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting dataset：", response.message);
      }
    }
  };
  return { deleteDataset };
};

export const handleUpdate = async (datasetUID, formData, onEdit, onClose) => {
  const { updateDataset } = useUpdateDataset(datasetUID, formData);
  const response = await updateDataset();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const handleDelete = async (datasetUID, onDelete, onClose) => {
  const { deleteDataset } = useDeleteDataset(datasetUID);
  const response = await deleteDataset();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};
