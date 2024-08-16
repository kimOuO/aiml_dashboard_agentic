import { useEffect, useState } from "react";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      const response = await testAPI("/getProjects");
      if (response && response.data) {
        setProjects(response.data);
      } else if (response && response instanceof Error) {
        console.error("Error fetching projects:", response.message);
      }
      setIsLoading(false);
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

//取得organization
export const useFetchOrganization = () => {
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      const response = await testAPI("getOrganization");
      if (response && response.data) {
        setOrganization(response.data);
      } else {
        console.error("Error fetching organization:", response.message);
      }
    };

    fetchOrganization();
  }, []);

  return organization;
};

//創建project
export const useCreateProject = () => {
  const createProject = async (formData) => {
    if (formData) {
      const response = await testAPI("createProject", formData);
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating project:", response.message);
      }
    }
  };
  return { createProject };
};

//更新project
export const useUpdateProject = (projectUID, formData) => {
  const updateProject = async () => {
    if (projectUID) {
      const response = await testAPI("updateProject", {
        uid: projectUID,
        ...formData,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating project:", response.message);
      }
    }
  };
  return { updateProject };
};

//刪除project
export const useDeleteProject = (projectUID) => {
  const deleteProject = async () => {
    if (projectUID) {
      const response = await testAPI("/deleteProject", {
        uid: projectUID,
      });
      if (response && response.data) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting project:", response.message);
      }
    }
  };
  return { deleteProject };
};

export const HandleUpdate = async (projectUID, formData, onEdit, onClose) => {
  const { updateProject } = useUpdateProject(projectUID, formData);
  const response = await updateProject();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (projectUID, onDelete, onClose) => {
  const { deleteProject } = useDeleteProject(projectUID);
  const response = await deleteProject();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createProject } = useCreateProject();
  const response = await createProject(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};
