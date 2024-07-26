import { useEffect, useState } from "react";
import { getTestAPI, putTestAPI, deleteTestAPI } from "@/app/api/entrypoint";

export const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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

export const useUpdateProject = (projectUID, formData) => {
  const updateProject = async () => {
    if (projectUID) {
      const response = await putTestAPI(`projects/${projectUID}`, formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating project:", response.message);
      }
    }
  };
  return { updateProject };
};

export const useDeleteProject = (projectUID) => {
  const deleteProject = async () => {
    if (projectUID) {
      const response = await deleteTestAPI(`projects/${projectUID}`);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting project:", response.message);
      }
    }
  };
  return { deleteProject };
};

export const handleUpdate = async (projectUID, formData, onEdit, onClose) => {
  const { updateProject } = useUpdateProject(projectUID, formData);
  const response = await updateProject();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const handleDelete = async (projectUID, onDelete, onClose) => {
  const { deleteProject } = useDeleteProject(projectUID);
  const response = await deleteProject();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};
