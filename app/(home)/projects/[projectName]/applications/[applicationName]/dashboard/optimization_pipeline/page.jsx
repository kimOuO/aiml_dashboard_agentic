"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { useFetchPipeline } from "../preprocessing_pipeline/service";
import { PipelineCard } from "../preprocessing_pipeline/pipelineCard";

export default function OptimizationPipelinePage() {
  const { projectName, applicationName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");

  const handleBackClick = useBackNavigation();
  const type = "Retrain";
  const {
    pipelines: optimiPipelines,
    isLoading,
    triggerFetch,
  } = useFetchPipeline(applicationUID, type);

  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects / {projectNameDecode} / Applications /
              <span className="text-black"> {applicationNameDecode}</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" alt="Back" />
              </button>
              <p className="text-3xl">Optimization Pipeline</p>
            </div>
          </div>
          <button className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl ">
            Upload Optimization Pipeline
          </button>
        </div>
        {/*放card */}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {optimiPipelines.map((tunPipe) => (
              <PipelineCard
                key={tunPipe.id}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                pipeline={tunPipe}
                path="optimization_pipeline"
                onEdit={triggerFetch}
                onDelete={triggerFetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
