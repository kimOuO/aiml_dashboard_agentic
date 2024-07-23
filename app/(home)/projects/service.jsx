import { useEffect, useState } from "react";
import { getTestAPI, putTestAPI, deleteTestAPI } from "@/app/api/entrypoint";

export const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      //開始抓取資料，畫面顯示loading
      const response = await getTestAPI(`projects`);
      if (response && response.data) {
        setProjects(response.data);
        setIsLoading(false);
      } else if (response && response instanceof Error) {
        console.error("Error fetching projects:", response.message);
      }
    };
    fetchProjects();
  }, [fetchTrigger]);

  return {
    projects,
    isLoading,
    // 用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

export const useUpdateProjects = (projectId, formData) => {
  const updateProject = async () => {
    if (projectId) {
      const response = await putTestAPI(`projects/${projectId}`, formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating projects:", response.message);
      }
    }
  };
  return { updateProject };
};

export const useDeleteProjects = (projectId) => {
  const deleteProject = async () => {
    if (projectId) {
      const response = await deleteTestAPI(`projects/${projectId}`);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting projects:", response.message);
      }
    }
  };
  return { deleteProject };
};

export const handleUpdate = async (projectId, formData, onEdit, onClose) => {
  const { updateProject } = useUpdateProjects(projectId, formData);
  const response = await updateProject();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const handleDelete = async (projectId, onDelete, onClose) => {
  const { deleteProject } = useDeleteProjects(projectId);
  const response = await deleteProject();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};
