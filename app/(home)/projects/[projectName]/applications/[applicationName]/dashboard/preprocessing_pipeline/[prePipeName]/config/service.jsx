"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchConfigs = (pipelineUID, type) => {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchConfigs = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (pipelineUID && type) {
        const response = await testAPI("getConfigs", {
          uid: pipelineUID,
          type,
        });
        if (response && response.data) {
          setConfigs(response.data);
        } else if (response && response instanceof Error) {
          console.log("Error fetching config：", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchConfigs();
  }, [pipelineUID, type]);
  return { configs, isLoading };
};

const useFindApplicationUID = (pipelineUID) => {
  const [applicationUID, setApplicationUID] = useState(null);
  useEffect(() => {
    const fetchApplicationUID = async () => {
      if (pipelineUID) {
        const response = await testAPI("getPipeline", { uid: pipelineUID });
        if (response && response.data) {
          setApplicationUID(response.data.f_application_uid);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipeline：", response.message);
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
