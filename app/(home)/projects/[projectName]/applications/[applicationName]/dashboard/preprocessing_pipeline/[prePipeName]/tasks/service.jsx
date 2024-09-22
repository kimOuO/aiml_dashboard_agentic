"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchTask = (pipelineUID) => {
  const [tasks, setTasks] = useState([]);
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
    fetchTasks();
  }, [pipelineUID, fetchTrigger]);
  return {
    tasks,
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
        // Preparer/preprocessing
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI(
          APIKEYS.PREPARER_PREPROCESSING_TASK,
          data
        );
        if (response.status === 200) {
          setTaskFile(response.data.data);
        }
      }
    };
    fetchTaskFile();
  }, [pipelineUID]);

  return { taskFile };
};

//啟動preprocessing task
export const useRunPreprocessingTask = () => {
  const runTask = async (formData) => {
    if (formData) {
      //TaskWorker/preprocessing
      const response = await getAPI(APIKEYS.RUN_PREPROCESSING_TASK, formData);
      if (response) return response;
    }
  };
  return { runTask };
};

//更新task
export const useUpdateTask = (formData) => {
  const updateTask = async () => {
    if (formData) {
      //TaskMetadataWriter/update
      const response = await getAPI(APIKEYS.UPDATE_TASK_METADATA, formData);
      if (response) return response;
    }
  };
  return { updateTask };
};

//刪除task
export const useDeleteTask = (taskUID) => {
  const deleteTask = async () => {
    if (taskUID) {
      //TaskMetadataWriter/delete
      const data = { uid: taskUID };
      const response = await getAPI(APIKEYS.DELETE_TASK_METADATA, data);
      if (response) return response;
    }
  };
  return { deleteTask };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateTask } = useUpdateTask(formData);
  const response = await updateTask();
  if (response.status === 200) {
    onEdit();
    onClose();
  }
  return response;
};

export const HandleDelete = async (taskUID, onDelete, onClose) => {
  const { deleteTask } = useDeleteTask(taskUID);
  const response = await deleteTask();
  if (response.status === 200) {
    onDelete();
    onClose();
  }
  return response;
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { runTask } = useRunPreprocessingTask();
  const response = await runTask(formData);
  if (response.status === 200) {
    // 執行成功後觸發 onCreate 和 onClose
    onCreate();
    onClose();
  }
  return response;
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
