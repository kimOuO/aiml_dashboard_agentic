"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchTrainingPipeline = (projectName, applicationName) => {
  const [trainingPipelines, setTrainingPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName) {
      const fetchTrainingPipeline = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/trainingPipelines`
        );
        if (response && response.data) {
          setTrainingPipelines(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.log("Error fetching training pipeline：", response.message);
        }
      };
      fetchTrainingPipeline();
    }
  }, [projectName, applicationName]);
  return { trainingPipelines, isLoading };
};

export const handleLinkClick = (projectName, applicationName) => {
  const router = useRouter();

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model`
    );
  };
  const handlePreprocessingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline`
    );
  };

  return { handleModelClick, handlePreprocessingPipelineClick };
};
