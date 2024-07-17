"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useFetchTrainingPipeline = (projectName, applicationName) => {
  const [trainingPipelines, setTrainingPipelines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectName && applicationName) {
      const fetchTrainingPipeline = async () => {
        try {
          //開始抓資料，畫面顯示loading
          setIsLoading(true);
          const response = await axios.get(
            `/api/projects/${projectName}/applications/${applicationName}/trainingPipelines`
          );
          setTrainingPipelines(response.data);
        } catch (error) {
          console.log("Error fetching training pipeline：", error);
        } finally {
          //結束抓資料，畫面顯示資料
          setIsLoading(false);
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

  return { handleModelClick, handlePreprocessingPipelineClick};
};
