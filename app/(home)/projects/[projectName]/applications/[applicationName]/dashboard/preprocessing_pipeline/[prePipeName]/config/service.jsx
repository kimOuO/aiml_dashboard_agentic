"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchConfigs = (pipelineUID, type) => {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (pipelineUID && type) {
      const fetchConfigs = async () => {
        const response = await getTestAPI(`configs`, { pipelineUID, type });
        if (response && response.data) {
          setConfigs(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log("Error fetching config：", response.message);
        }
      };
      fetchConfigs();
    }
  }, [pipelineUID, type]);
  return { configs, isLoading };
};

const useFindApplicationUID = (pipelineUID) => {
  const [applicationUID, setApplicationUID] = useState(null);
  useEffect(() => {
    if (pipelineUID) {
      const fetchApplicationUID = async () => {
        const response = await getTestAPI(`pipelines/${pipelineUID}`);
        if (response && response.data) {
          setApplicationUID(response.data.f_application_uid);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipelin：", response.message);
        }
      };
      fetchApplicationUID();
    }
  }, [pipelineUID]);
  return { applicationUID };
};

export const handleLinkClick = (
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
