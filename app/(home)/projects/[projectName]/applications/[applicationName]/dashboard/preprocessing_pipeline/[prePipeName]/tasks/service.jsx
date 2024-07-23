"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchPreprocessingTask = (
  projectName,
  applicationName,
  prePipeName
) => {
  const [preprocessingTasks, setPreprocessingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName && prePipeName) {
      const fetchPreprocessingTask = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/preprocessingPipelines/${prePipeName}/tasks`
        );
        if (response && response.data) {
          setPreprocessingTasks(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error(
            "Error fetching preprocessing task：",
            response.message
          );
        }
      };
      fetchPreprocessingTask();
    }
  }, [projectName, applicationName, prePipeName]);
  return { preprocessingTasks, isLoading };
};

export const handleLinkClick = (projectName, applicationName, prePipeName) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/build_file`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/config`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
