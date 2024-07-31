"use client";

import { useRouter } from "next/navigation";

export const HandleLinkClick = (
  projectName,
  applicationName,
  prePipeName,
  pipelineUID
) => {
  const router = useRouter();

  const handleTasksClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/tasks?pipelineUID=${pipelineUID}`
    );
  };

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model?pipelineUID=${pipelineUID}`
    );
  };

  const handleBuildFileClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline/${prePipeName}/build_file?pipelineUID=${pipelineUID}`
    );
  };

  return {
    handleTasksClick,
    handleModelClick,
    handleBuildFileClick,
  };
};
