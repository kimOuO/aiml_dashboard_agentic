import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchDatasets = (projectUID, searchQuery, currentPage) => {
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
        const response = await getAPI("MyC2aIHtzkZJrEGi", data);
        if (response.status === 200) {
          setDatasets(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching datasets:", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchProjectDatasets();
  }, [projectUID, searchQuery, currentPage, fetchTrigger]);
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
      const response = await getAPI("uqm5wN6pdrAWM89T", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating dataset：", response.data);
      }
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
      const response = await getAPI("6PiGXBbrIvQLqhrC", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting dataset：", response.data);
      }
    }
  };
  return { deleteDataset };
};

//創建dataset
export const useCreateDataset = () => {
  const createDataset = async (formData) => {
    if (formData) {
      //ProjectDatasetMetadataWriter/create
      const response = await getAPI("OFbaCJE62lcPVbZj", formData, true);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating dataset:", response.data);
      }
    }
  };
  return { createDataset };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateDataset } = useUpdateDataset(formData);
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
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};
