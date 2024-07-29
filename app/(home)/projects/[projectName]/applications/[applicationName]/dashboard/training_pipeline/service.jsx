"use client";
import { useRouter } from "next/navigation";

export const handleLinkClick = (
  projectName,
  applicationName,
  applicationUID
) => {
  const router = useRouter();

  const handleModelClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/model?applicationUID=${applicationUID}`
    );
  };
  const handlePreprocessingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/preprocessing_pipeline?applicationUID=${applicationUID}`
    );
  };

  return { handleModelClick, handlePreprocessingPipelineClick };
};
