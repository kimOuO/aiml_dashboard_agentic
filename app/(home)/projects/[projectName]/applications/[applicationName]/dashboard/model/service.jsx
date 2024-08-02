"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/app/api/entrypoint";

export const useFetchModels = (applicationUID) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchModels = async () => {
      //開始抓取資料，畫面顯示loading
      setIsLoading(true);
      if (applicationUID) {
        const response = await testAPI("getModels", { uid: applicationUID });
        if (response && response.data) {
          setModels(response.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching models：", response.message);
        }
        setIsLoading(false);
      }
    };
    fetchModels();
  }, [applicationUID]);
  return { models, isLoading };
};

export const HandleLinkClick = (
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
