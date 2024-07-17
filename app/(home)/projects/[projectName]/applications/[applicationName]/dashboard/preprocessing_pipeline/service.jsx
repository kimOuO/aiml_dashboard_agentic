"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useFetchPreprocessingPipeline = (projectName, applicationName) => {
  const [preprocessingPipelines, setPreprocessingPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName) {
      const fetchPreprocessingPipeline = async () => {
        try {
          //開始抓取資料，畫面顯示loading
          setIsLoading(true);
          const response = await axios.get(
            `/api/projects/${projectName}/applications/${applicationName}/preprocessingPipelines`
          );
          setPreprocessingPipelines(response.data);
        } catch (error) {
          console.error("Error fetching preprocessing pipeline：", error);
        } finally {
          //結束抓資料，畫面顯示資料
          setIsLoading(false);
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
