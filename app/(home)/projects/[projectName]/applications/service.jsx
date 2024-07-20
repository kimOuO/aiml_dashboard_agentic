"use client";

import { useEffect, useState } from "react";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchApplications = (projectName) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectName) {
      const fetchApplications = async () => {
        //開始抓取資料，畫面顯示loading
        const response = await getTestAPI(
          `projects/${projectName}/applications`
        );
        if (response && response.data) {
          setApplications(response.data);
          setIsLoading(false);
        } else if (response && response instanceof Error) {
          console.error("Error fetching applications:", response.message);
        }
      };

      fetchApplications();
    }
  }, [projectName]);

  return { applications, isLoading };
};
