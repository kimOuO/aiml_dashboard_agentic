"use client";

import { useRouter } from "next/navigation";

export const HandleLinkClick = (
  projectName,
  applicationName,
  evaluaPipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleConfigClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/evaluation_pipeline/${evaluaPipeName}/config?pipelineUID=${pipelineUID}`
    );
  };
  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/evaluation_pipeline/${evaluaPipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  return { handleConfigClick, handleTasksClick };
};
