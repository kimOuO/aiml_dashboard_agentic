"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchPreprocessingBuildFile = (
  projectName,
  applicationName,
  prePipeName
) => {
  const [preprocessingBuildFile, setPreprocessingBuildFile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName && prePipeName) {
      const fetchPreprocessingBuildFile = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/preprocessingPipelines/${prePipeName}/build_files`
        );
        if (response && response.data) {
          setPreprocessingBuildFile(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log(
            "Error fetching preprocessing build file：",
            response.message
          );
        }
      };
      fetchPreprocessingBuildFile();
    }
  }, [projectName, applicationName, prePipeName]);
  return { preprocessingBuildFile, isLoading };
};

export const handleLinkClick = (projectName, applicationName, prePipeName) => {
  const router = useRouter();

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/config`
    );
  };
  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/tasks`
    );
  };

  return { handleConfigClick, handleTasksClick };
};
