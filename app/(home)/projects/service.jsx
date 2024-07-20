import { useEffect, useState } from "react";
import { getTestAPI } from "@/app/api/entrypoint";

export const useFetchProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      //開始抓取資料，畫面顯示loading
      const response = await getTestAPI("projects");
      if (response && response.data) {
        setProjects(response.data);
        setIsLoading(false);
      } else if (response && response instanceof Error) {
        console.error("Error fetching projects:", response.message);
      }
    };

    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
  };
};
