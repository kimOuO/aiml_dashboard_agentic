"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchTrainingTask = (projectName, applicationName, trainPipeName) => {
  const [trainingTasks, setTrainingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    //if () {
    const fetchTrainingTask = async () => {
      const response = await getTestAPI(`projects/${projectName}/applications/${applicationName}/trainingPipelines/${trainPipeName}/tasks`);
      if (response && response.data) {
        setTrainingTasks(response.data);
        setIsLoading(false);
      } else if (response && response instanceof Error) {
        console.error(
          "Error fetching training task：",
          response.message
        );
      }
    };
    fetchTrainingTask();
    //}
  },[projectName,applicationName]);
  return { trainingTasks, isLoading };
};

export const handleLinkClick = (projectName, applicationName, trainPipeName) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${trainPipeName}/build_file`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${trainPipeName}/config`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
