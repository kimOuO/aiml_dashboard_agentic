"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchPreprocessingPipeline = (projectName, applicationName) => {
  const [preprocessingPipelines, setPreprocessingPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName) {
      const fetchPreprocessingPipeline = async () => {
        const response = await getTestAPI(
          `projects/${projectName}/applications/${applicationName}/preprocessingPipelines`
        );
        if (response && response.data) {
          setPreprocessingPipelines(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error(
            "Error fetching preprocessing pipeline：",
            response.message
          );
        }
      };
      fetchPreprocessingPipeline();
    }
  }, [projectName, applicationName]);

  return { preprocessingPipelines, isLoading };
};

export const handleLinkClick = (projectName, applicationName) => {
  const router = useRouter();

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline`
    );
  };

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model`
    );
  };

  return { handleTrainingPipelineClick, handleModelClick };
};
