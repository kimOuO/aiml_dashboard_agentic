import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";

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
      if (applicationUID) {
        //ApplicationDatasetMetadataWriter/filter_by_application
        const data = { f_application_uid: applicationUID };
        const response = await getAPI("1sphuopUuLnIqoPU", data);
        if (response.status === 200) {
          //根據activeTab過濾datasets
          const filteredDatasets = response.data.data.filter(
            (dataset) => dataset.type === activeTab
          );
          setOptimiDatasets(filteredDatasets);
        } else if (response && response instanceof Error) {
          console.error("Error fetching datasets:", response.data);
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
export const useUpdateDataset = (formData) => {
  const updateOptimiDataset = async () => {
    if (formData) {
      //ApplicationDatasetMetadataWriter/update
      const response = await getAPI("lXqKKZYiy6XKJaVg", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating dataset:", response.data);
      }
    }
  };
  return { updateOptimiDataset };
};

//刪除OptimiDataset
export const useDeleteDataset = (datasetUID) => {
  const deleteOptimiDataset = async () => {
    if (datasetUID) {
      //ApplicationDatasetMetadataWriter/delete
      const data = { uid: datasetUID };
      const response = await getAPI("9uKWKnG5ZTSew1HD", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting dataset:", response.data);
      }
    }
  };
  return { deleteOptimiDataset };
};

//創建OptimiDataset
export const useCreateDataset = () => {
  const createOptimiDataset = async (formData) => {
    if (formData) {
      //ApplicationDatasetMetadataWriter/create
      const response = await getAPI("5fk1gVLi8q0mcHf4", formData, true);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating dataset:", response.data);
      }
    }
  };
  return { createOptimiDataset };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateOptimiDataset } = useUpdateDataset(formData);
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
