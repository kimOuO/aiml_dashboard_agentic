import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";
export const useFetchAgents = (organizationUID) => {
  const [Agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      //AgentMetadataWriter/filter_by_organization
      const data = { f_organization_uid: organizationUID };
      const response = await getAPI(APIKEYS.FILTER_AGENT_BY_ORGANIZATION, data);
      if (response.status === 200) {
        setAgents(response.data.data);
      } else if (response && response instanceof Error) {
        console.error("Error fetching Agents:", response.data);
      }
      setIsLoading(false);
    };
    fetchAgents();
  }, [fetchTrigger]);

  return {
    Agents,
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
      const response = await getAPI("mGlkFLqgBQgNRvU3", data);
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

//創建agent
export const useCreateAgent = () => {
  const createAgent = async (formData) => {
    if (formData) {
      //AgentTopicManager/create
      const response = await getAPI("SwuMUkAwSESxBkUw", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating agent:", response.data);
      }
    }
  };
  return { createAgent };
};

//更新agent
export const useUpdateAgent = (formData) => {
  const updateAgent = async () => {
    if (formData) {
      //AgentMetadataWriter/update
      const response = await getAPI(APIKEYS.UPDATE_AGENT, formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating agent:", response.data);
      }
    }
  };
  return { updateAgent };
};

//刪除agent
export const useDeleteAgent = (agentUID) => {
  const deleteAgent = async () => {
    if (agentUID) {
      //AgentTopicManager/delete
      const data = { agent_uid: agentUID };
      const response = await getAPI("wneZ8lVKrcf70ttU", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting agent:", response.data);
      }
    }
  };
  return { deleteAgent };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateAgent } = useUpdateAgent(formData);
  const response = await updateAgent();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (agentUID, onDelete, onClose) => {
  const { deleteAgent } = useDeleteAgent(agentUID);
  const response = await deleteAgent();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createAgent } = useCreateAgent();
  const response = await createAgent(formData);
  if (response && !(response instanceof Error)) {
    onCreate();
    onClose();
  }
};
