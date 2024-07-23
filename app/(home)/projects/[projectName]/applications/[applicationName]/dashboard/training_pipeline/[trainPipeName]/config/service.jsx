"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchTrainingConfig = (
  projectName,
  applicationName,
  prePipeName
) => {
  const [trainingConfig, setTrainingConfig] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName && prePipeName) {
      const fetchTrainingConfig = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/trainingPipelines/${prePipeName}/configs`
        );
        if (response && response.data) {
          setTrainingConfig(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log("Error fetching training config：", response.message);
        }
      };
      fetchTrainingConfig();
    }
  }, [projectName, applicationName, prePipeName]);
  return { trainingConfig, isLoading };
};

export const handleLinkClick = (projectName, applicationName, prePipeName) => {
  const router = useRouter();

  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/tasks`
    );
  };

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model`
    );
  };

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/build_file`
    );
  };

  return {
    handleTasksClick,
    handleModelClick,
    handleBuildFileClick,
  };
};
