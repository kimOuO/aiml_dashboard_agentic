"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchTask = (pipelineUID, type) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (pipelineUID && type) {
      const fetchTask = async () => {
        const response = await getTestAPI(`tasks`, { pipelineUID, type });
        if (response && response.data) {
          setTasks(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error("Error fetching task：", response.message);
        }
      };
      fetchTask();
    }
  }, [pipelineUID, type]);
  return { tasks, isLoading };
};

export const handleLinkClick = (
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
