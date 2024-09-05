"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchTaskFile = (pipelineUID) => {
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    const fetchTaskFile = async () => {
      if (pipelineUID) {
        // Preparer/retrain
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI("ur2rcOusIa91PFX5", data);
        if (response.status === 200) {
          setTaskFile(response.data.data);
        } else {
          setError("Failed to fetch task file");
        }
      }
    };
    fetchTaskFile();
  }, [pipelineUID]);

  return { taskFile };
};

export const HandleLinkClick = (
  projectName,
  applicationName,
  optimiPipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/optimization_pipeline/${optimiPipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/optimization_pipeline/${optimiPipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
