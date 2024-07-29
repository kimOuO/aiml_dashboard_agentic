"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchModels = (applicationUID) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (applicationUID) {
      const fetchModels = async () => {
        const response = await getTestAPI(`models`, { applicationUID });
        if (response && response.data) {
          setModels(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error("Error fetching models：", response.message);
        }
      };
      fetchModels();
    }
  }, [applicationUID]);

  return { models, isLoading };
};

export const handleLinkClick = (
  projectName,
  applicationName,
  applicationUID
) => {
  const router = useRouter();

  const handlePreprocessingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline?applicationUID=${applicationUID}`
    );
  };

  return { handlePreprocessingPipelineClick, handleTrainingPipelineClick };
};
