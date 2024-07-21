"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchTrainingTask = ({projectName, applicationName}) => {
  const [trainingTasks, setTrainingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    //if () {
    const fetchTrainingTask = async () => {
      const response = await getTestAPI(`tasks`);
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

export const handleLinkClick = (projectName, applicationName) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/build_file`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/config`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
