"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchTaskFile = (pipelineUID) => {
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    const fetchTaskFile = async () => {
      if (pipelineUID) {
        // Preparer/evaluation
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI("8O1f02CSk0Su3czR", data);
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

//啟動evaluation task
export const useRunEvaluationTask = () => {
  const runTask = async (formData) => {
    if (formData) {
      //TaskWorker/evaluation
      const response = await getAPI("u8Wo0fVM6pFEthFH", formData);
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
  const { createTask } = useCreateTask();
  const { runTask } = useRunEvaluationTask();

  //傳遞到createTask api所需的資料
  const createTaskData = {
    name: formData.task_name,
    description: formData.task_description,
    f_pipeline_uid: formData.pipeline_uid,
  };
  const response = await createTask(createTaskData);
  if (response && !(response instanceof Error)) {
    // 如果任務創建成功，接著呼叫 runTask 來啟動任務
    const runTaskResponse = await runTask(formData);

    if (runTaskResponse && !(runTaskResponse instanceof Error)) {
      // 執行成功後觸發 onCreate 和 onClose
      onCreate();
      onClose();
    }
  }
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  evaluaPipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/evaluation_pipeline/${evaluaPipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/evaluation_pipeline/${evaluaPipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
