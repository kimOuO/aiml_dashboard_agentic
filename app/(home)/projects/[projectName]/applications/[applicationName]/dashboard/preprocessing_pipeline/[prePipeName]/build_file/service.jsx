"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchBuildFiles = (pipelineUID, type) => {
  const [buildFiles, setBuildFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchBuildFiles = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID && type) {
        const response = await testAPI("getBuildFiles", {
          uid: pipelineUID,
          type,
        });
        if (response && response.data) {
          setBuildFiles(response.data);
        } else if (response && response instanceof Error) {
          console.log("Error fetching build files：", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchBuildFiles();
  }, [pipelineUID, type]);
  return { buildFiles, isLoading };
};

export const HandleLinkClick = (
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
