"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAPI } from "@/app/api/entrypoint";

export const useFetchTaskFile = (pipelineUID) => {
  const [taskFile, setTaskFile] = useState(null);

  useEffect(() => {
    const fetchTaskFile = async () => {
      if (pipelineUID) {
        // Preparer/training
        const data = { pipeline_uid: pipelineUID };
        const response = await getAPI("Q3aPI7vZrzp3d4SI", data);
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
  trainPipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${trainPipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${trainPipeName}/config?pipelineUID=${pipelineUID}`
    );
  };

  return { handleBuildFileClick, handleConfigClick };
};
