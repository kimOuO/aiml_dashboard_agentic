"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchTrainingBuildFile = (
  projectName,
  applicationName,
  trainPipeName
) => {
  const [trainingBuildFile, setTrainingBuildFile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName && trainPipeName) {
      const fetchTrainingBuildFile = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/trainingPipelines/${trainPipeName}/build_files`
        );
        if (response && response.data) {
          setTrainingBuildFile(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log("Error fetching training build file：", response.message);
        }
      };
      fetchTrainingBuildFile();
    }
  }, [projectName, applicationName, trainPipeName]);
  return { trainingBuildFile, isLoading };
};

export const handleLinkClick = (projectName, applicationName, prePipeName) => {
  const router = useRouter();

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/config`
    );
  };
  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/tasks`
    );
  };

  return { handleConfigClick, handleTasksClick };
};
