"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchTask = (pipelineUID, organizationUID) => {
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //用於觸發重新抓取data
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID) {
        //TaskMetadataWriter/filter_by_pipeline
        const data = { f_pipeline_uid: pipelineUID };
        const response = await getAPI(APIKEYS.FILTER_TASK_BY_PIPELINE, data);
        if (response.status === 200) {
          setTasks(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching task：", response.data);
        }
        setIsLoading(false);
      }
    };

    const fetchAgents = async () => {
      if (organizationUID) {
        //AgentMetadataWriter/filter_by_organization
        const data = { f_organization_uid: organizationUID };
        const response = await getAPI(
          APIKEYS.FILTER_AGENT_BY_ORGANIZATION,
          data
        );
        if (response.status === 200) {
          setAgents(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching agents:", response.data);
        }
      }
    };

    fetchAgents();
    fetchTasks();
  }, [pipelineUID, organizationUID, fetchTrigger]);
  return {
    tasks,
    agents,
    isLoading,
    //用於觸發重新抓取
    triggerFetch: () => setFetchTrigger(!fetchTrigger),
  };
};

export const useFetchTaskFile = (pipelineUID) => {
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    const fetchTaskFile = async () => {
      if (pipelineUID) {
        // Preparer/retrain
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI(APIKEYS.PREPARER_OPTIMIZATION_TASK, data);
        if (response.status === 200) {
          setTaskFile(response.data.data);
        }
      }
    };
    fetchTaskFile();
  }, [pipelineUID]);

  return { taskFile };
};

//啟動retrain task
export const useRunRetrainTask = () => {
  const runTask = async (formData) => {
    if (formData) {
      //TaskWorker/retrain
      const response = await getAPI(APIKEYS.RUN_RETRAIN_TASK, formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error running task:", response.data);
      }
    }
  };
  return { runTask };
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { runTask } = useRunRetrainTask();

  const runTaskResponse = await runTask(formData);

  if (runTaskResponse && !(runTaskResponse instanceof Error)) {
    // 執行成功後觸發 onCreate 和 onClose
    onCreate();
    onClose();
  }
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  optimiPipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/optimization_pipeline/${optimiPipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/optimization_pipeline/${optimiPipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
