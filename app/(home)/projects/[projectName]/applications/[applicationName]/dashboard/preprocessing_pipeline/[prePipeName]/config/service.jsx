"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchConfigs = (pipelineUID) => {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchConfigs = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID) {
        //ConfigMetadataWriter/filter_by_pipeline
        const data = { f_pipeline_uid: pipelineUID };
        const response = await getAPI("NVVJBLsdkIjTLB2P", data);
        if (response.status === 200) {
          setConfigs(response.data.data);
        } else if (response && response instanceof Error) {
          console.log("Error fetching config：", response.data);
        }
        setIsLoading(false);
      }
    };
    fetchConfigs();
  }, [pipelineUID]);
  return { configs, isLoading };
};

const useFindApplicationUID = (pipelineUID) => {
  const [applicationUID, setApplicationUID] = useState(null);
  useEffect(() => {
    const fetchApplicationUID = async () => {
      if (pipelineUID) {
        //PipelineMetadataWriter/retrieve
        const data = { uid: pipelineUID };
        const response = await getAPI("owbCDAJ9rJW2AEO5", data);
        if (response.status === 200) {
          setApplicationUID(response.data.f_application_uid);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipeline：", response.data);
        }
      }
    };
    fetchApplicationUID();
  }, [pipelineUID]);
  return { applicationUID };
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const { applicationUID } = useFindApplicationUID(pipelineUID);

  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline/${prePipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  return {
    handleTasksClick,
    handleTrainingPipelineClick,
    handleBuildFileClick,
  };
};
