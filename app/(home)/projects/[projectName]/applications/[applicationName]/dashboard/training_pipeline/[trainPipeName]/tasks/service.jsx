"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchTaskFile = (pipelineUID) => {
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    const fetchTaskFile = async () => {
      if (pipelineUID) {
        // Preparer/training
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI(APIKEYS.PREPARER_TRAINING_TASK, data);
        if (response.status === 200) {
          setTaskFile(response.data.data);
        }
      }
    };
    fetchTaskFile();
  }, [pipelineUID]);

  return { taskFile };
};

//啟動training task
export const useRunTrainingTask = () => {
  const runTask = async (formData) => {
    if (formData) {
      //TaskWorker/training
      const response = await getAPI(APIKEYS.RUN_TRAINING_TASK, formData);
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
  const { runTask } = useRunTrainingTask();
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
  trainPipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${trainPipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${trainPipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};

//刪除task
export const useDeleteTask = (taskUID) => {
  const deleteTask = async () => {
    if (taskUID) {
      //TaskMetadataWriter/delete
      const data = { uid: taskUID };
      const response = await getAPI(APIKEYS.DELETE_TASK_METADATA, data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting task", response.data);
      }
    }
  };
  return { deleteTask };
};

//更新task
export const useUpdateTask = (formData) => {
  const updateTask = async () => {
    if (formData) {
      //TaskMetadataWriter/update
      const response = await getAPI(APIKEYS.UPDATE_TASK_METADATA, formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating task:", response.data);
      }
    }
  };
  return { updateTask };
};

export const HandleDelete = async (taskUID, onDelete, onClose) => {
  const { deleteTask } = useDeleteTask(taskUID);

  const response = await deleteTask();
  if (response && !(response instanceof Error)) {
    onDelete();
    onClose();
  }
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateTask } = useUpdateTask(formData);
  const response = await updateTask();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};
