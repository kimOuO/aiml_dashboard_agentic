"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchPreprocessingConfig = (
  projectName,
  applicationName,
  prePipeName
) => {
  const [preprocessingConfig, setPreprocessingConfig] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName && prePipeName) {
      const fetchPreprocessingConfig = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/preprocessingPipelines/${prePipeName}/configs`
        );
        if (response && response.data) {
          setPreprocessingConfig(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log(
            "Error fetching preprocessing config：",
            response.message
          );
        }
      };
      fetchPreprocessingConfig();
    }
  }, [projectName, applicationName, prePipeName]);
  return { preprocessingConfig, isLoading };
};

export const handleLinkClick = (projectName, applicationName, prePipeName) => {
  const router = useRouter();

  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/tasks`
    );
  };

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline`
    );
  };

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/build_file`
    );
  };

  return {
    handleTasksClick,
    handleTrainingPipelineClick,
    handleBuildFileClick,
  };
};
