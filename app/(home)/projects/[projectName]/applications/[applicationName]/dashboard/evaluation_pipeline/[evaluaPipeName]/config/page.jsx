"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { HandleLinkClick } from "./service";
import { useFetchConfigs } from "../../../preprocessing_pipeline/[prePipeName]/config/service";
import { ConfigCard } from "../../../preprocessing_pipeline/[prePipeName]/config/configCard";

export default function EvaluationConfigPage() {
  const { projectName, applicationName, evaluaPipeName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const evaluaPipeNameDecode = decodeURIComponent(evaluaPipeName);
  const searchParams = useSearchParams();
  const pipelineUID = searchParams.get("pipelineUID");

  const handleBackClick = useBackNavigation();
  const { configs: evaluationConfigs, isLoading } =
    useFetchConfigs(pipelineUID);
  const { handleTasksClick, handleModelClick, handleBuildFileClick } =
    HandleLinkClick(
      projectNameDecode,
      applicationNameDecode,
      evaluaPipeNameDecode,
      pipelineUID
    );
  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects / {projectNameDecode} / Applications /{" "}
              {applicationNameDecode} / Evaluation Pipeline /
              <span className="text-black"> {evaluaPipeNameDecode} </span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" alt="Back" />
              </button>
              <p className="text-3xl">Config</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <div
                className="bg-green-100 text-green-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2"
                onClick={handleTasksClick}
              >
                <span>Tasks</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
              <div
                className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 "
                onClick={handleModelClick}
              >
                <span>Model</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
              <div
                className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 "
                onClick={handleBuildFileClick}
              >
                <span>Build File</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <button className="bg-green-800 text-white px-4 py-3 rounded-2xl text-xl ">
            Create Task Config
          </button>
        </div>
        {/*放card */}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {evaluaPipeName.map((evaluaConfig) => (
              <ConfigCard key={evaluaConfig.id} config={evaluaConfig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
