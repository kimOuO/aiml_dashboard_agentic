"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchBuildFiles = (pipelineUID, type) => {
  const [buildFiles, setBuildFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (pipelineUID && type) {
      const fetchBuildFiles = async () => {
        const response = await getTestAPI(`buildFiles`, { pipelineUID, type });
        if (response && response.data) {
          setBuildFiles(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log("Error fetching build files：", response.message);
        }
      };
      fetchBuildFiles();
    }
  }, [pipelineUID && type]);
  return { buildFiles, isLoading };
};

export const handleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/config?pipelineUID=${pipelineUID}`
    );
  };
  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  return { handleConfigClick, handleTasksClick };
};
