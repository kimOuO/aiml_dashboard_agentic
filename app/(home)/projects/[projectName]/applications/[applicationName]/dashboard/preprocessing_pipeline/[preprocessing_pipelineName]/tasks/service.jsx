"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchPreprocessingTask = ({projectName, applicationName}) => {
  const [preprocessingTasks, setPreprocessingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    //if () {
    const fetchPreprocessingTask = async () => {
      const response = await getTestAPI(`tasks`);
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
    //}
  },[projectName,applicationName]);
  return { preprocessingTasks, isLoading };
};

export const handleLinkClick = (projectName, applicationName) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/build_file`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/config`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
