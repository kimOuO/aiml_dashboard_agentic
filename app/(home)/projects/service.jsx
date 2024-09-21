import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchProjects = (organizationUID) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      //ProjectMetadataWriter/filter_by_organization
      const data = { f_organization_uid: organizationUID };
      const response = await getAPI(
        APIKEYS.FILTER_PROJECT_BY_ORGANIZATION,
        data
      );
      if (response.status === 200) {
        setProjects(response.data.data);
      } else if (response && response instanceof Error) {
        console.error("Error fetching projects:", response.data);
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, [fetchTrigger, organizationUID]);

  return {
    projects,
    isLoading,
    // 用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

//取得organization
export const useFetchOrganization = (organizationUID) => {
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      //OrganizationMetadataWriter/retrieve
      const data = { uid: organizationUID };
      const response = await getAPI(
        APIKEYS.RETRIEVE_ORGANIZATION_METADATA,
        data
      );
      if (response.status === 200) {
        setOrganization(response.data.data);
      } else {
        console.error("Error fetching organization:", response.data);
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
      //ProjectMetadataWriter/create
      const response = await getAPI(APIKEYS.CREATE_PROJECT_METADATA, formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating project:", response.data);
      }
    }
  };
  return { createProject };
};

//更新project
export const useUpdateProject = (formData) => {
  const updateProject = async () => {
    if (formData) {
      //ProjectMetadataWriter/update
      const response = await getAPI(APIKEYS.UPDATE_PROJECT_METADATA, formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating project:", response.data);
      }
    }
  };
  return { updateProject };
};

//刪除project
export const useDeleteProject = (projectUID) => {
  const deleteProject = async () => {
    if (projectUID) {
      //ProjectMetadataWriter/delete
      const data = { uid: projectUID };
      const response = await getAPI(APIKEYS.DELETE_PROJECT_METADATA, data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting project:", response.data);
      }
    }
  };
  return { deleteProject };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateProject } = useUpdateProject(formData);
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
