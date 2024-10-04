"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";
import APIKEYS from "@/app/api/api_key.json";

export const useFetchTaskFile = (pipelineUID) => {
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    const fetchTaskFile = async () => {
      if (pipelineUID) {
        // Preparer/evaluation
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI(APIKEYS.PREPARER_EVALUATION_TASK, data);
        if (response.status === 200) {
          setTaskFile(response.data.data);
        }
      }
    };
    fetchTaskFile();
  }, [pipelineUID]);

  return { taskFile };
};

//啟動evaluation task
export const useRunEvaluationTask = () => {
  const runTask = async (formData) => {
    if (formData) {
      //TaskWorker/evaluation
      const response = await getAPI(APIKEYS.RUN_EVALUATION_TASK, formData);
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
  const { runTask } = useRunEvaluationTask();

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
