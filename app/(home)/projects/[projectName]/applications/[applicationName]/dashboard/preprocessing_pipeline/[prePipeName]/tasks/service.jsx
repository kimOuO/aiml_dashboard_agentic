"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchTask = (pipelineUID) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID) {
        //TaskMetadataWriter/filter_by_pipeline
        const data = { f_pipeline_uid: pipelineUID };
        const response = await getAPI("getTasks", data);
        if (response.status === 200) {
          setTasks(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching task：", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [pipelineUID]);
  return { tasks, isLoading };
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
