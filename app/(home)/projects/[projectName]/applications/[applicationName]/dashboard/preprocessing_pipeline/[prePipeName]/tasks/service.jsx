"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

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
        const response = await getAPI("s8i1TNiTXwwv02mv", data);
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
        const response = await getAPI("oNjkVj60RqS8DQTX", data);
        if (response.status === 200) {
          setTaskFile(response.data.data);
        }
      }
    };
    fetchTaskFile();
  }, [pipelineUID]);

  return { taskFile };
};

//創建task
export const useCreateTask = () => {
  const createTask = async (createTaskData) => {
    if (createTaskData) {
      //TaskMetadataWriter/create
      const response = await getAPI("Za0lf5Tf5pI3fhMx", createTaskData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error creating task:", response.data);
      }
    }
  };
  return { createTask };
};

//啟動preprocessing task
export const useRunPreprocessingTask = () => {
  const runTask = async (formData) => {
    if (formData) {
      //TaskWorker/preprocessing
      const response = await getAPI("jPqyAFWh7hBKRRNK", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error running task:", response.data);
      }
    }
  };
  return { runTask };
};

//更新task
export const useUpdateTask = (formData) => {
  const updateTask = async () => {
    if (formData) {
      //TaskMetadataWriter/update
      const response = await getAPI("05wVeQQBhvFRTq54", formData);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error updating task:", response.data);
      }
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
      const response = await getAPI("AoTqlTmu8l47CbMU", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting task", response.data);
      }
    }
  };
  return { deleteTask };
};

//刪除task的工作
export const useDeleteTaskWorker = (taskUID) => {
  const deleteTaskWorker = async () => {
    if (taskUID) {
      //TaskWorker/delete
      const data = { task_uid: taskUID };
      const response = await getAPI("CNNfUmDpcWXp7vdM", data);
      if (response.status === 200) {
        return response.data;
      } else if (response && response instanceof Error) {
        console.error("Error deleting task", response.data);
      }
    }
  };
  return { deleteTaskWorker };
};

export const HandleUpdate = async (formData, onEdit, onClose) => {
  const { updateTask } = useUpdateTask(formData);
  const response = await updateTask();
  if (response && !(response instanceof Error)) {
    onEdit();
    onClose();
  }
};

export const HandleDelete = async (taskUID, onDelete, onClose) => {
  const { deleteTask } = useDeleteTask(taskUID);
  const { deleteTaskWorker } = useDeleteTaskWorker(taskUID);

  // const response = await deleteTask();
  // if (response && !(response instanceof Error)) {
  //   //如果metadata刪除成功，呼叫deleteTaskWorker動作
  //   const deleteTaskWorkerResponse = await deleteTaskWorker();
  //   if (
  //     deleteTaskWorkerResponse &&
  //     !(deleteTaskWorkerResponse instanceof Error)
  //   ) {
  //     onDelete();
  //     onClose();
  //   }
  // }
  const deleteTaskWorkerResponse = await deleteTaskWorker();
  if (
    deleteTaskWorkerResponse &&
    !(deleteTaskWorkerResponse instanceof Error)
  ) {
    onDelete();
    onClose();
  }
};

export const HandleCreate = async (formData, onCreate, onClose) => {
  const { createTask } = useCreateTask();
  const { runTask } = useRunPreprocessingTask();

  //傳遞到createTask api所需的資料
  const createTaskData = {
    name: formData.task_name,
    description: formData.task_description,
    f_pipeline_uid: formData.pipeline_uid,
  };
  // const response = await createTask(createTaskData);
  // if (response && !(response instanceof Error)) {
  //   // 如果任務創建成功，接著呼叫 runTask 來啟動任務
  //   const runTaskResponse = await runTask(formData);

  //   if (runTaskResponse && !(runTaskResponse instanceof Error)) {
  //     // 執行成功後觸發 onCreate 和 onClose
  //     onCreate();
  //     onClose();
  //   }
  // }
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
