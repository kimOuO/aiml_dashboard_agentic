"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchPipeline = (applicationUID, type) => {
  const [pipelines, setPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (applicationUID && type) {
      const fetchPipeline = async () => {
        const response = await getTestAPI(`pipelines`, {
          applicationUID,
          type,
        });
        if (response && response.data) {
          setPipelines(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error("Error fetching pipeline：", response.message);
        }
      };
      fetchPipeline();
    }
  }, [applicationUID, type]);
  console.log(pipelines);

  return { pipelines, isLoading };
};

export const handleLinkClick = (
  projectName,
  applicationName,
  applicationUID
) => {
  const router = useRouter();

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model?applicationUID=${applicationUID}`
    );
  };

  return { handleTrainingPipelineClick, handleModelClick };
};
