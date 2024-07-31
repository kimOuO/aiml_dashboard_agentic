"use client";

import { useRouter } from "next/navigation";

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/config?pipelineUID=${pipelineUID}`
    );
  };
  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  return { handleConfigClick, handleTasksClick };
};
