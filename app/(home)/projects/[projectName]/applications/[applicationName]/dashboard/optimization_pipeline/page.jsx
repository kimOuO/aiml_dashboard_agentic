"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { HandleLinkClick } from "./service";
import { useFetchPipeline } from "../preprocessing_pipeline/service";
import { PipelineCard } from "../preprocessing_pipeline/pipelineCard";

export default function OptimizationPipelinePage() {
  const { projectName, applicationName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");

  const handleBackClick = useBackNavigation();
  const type1 = "Tuning";
  const type2 = "Retraining";
  const {
    pipelines: tuningPipelines,
    isLoading: tuningLoading,
    triggerFetch: tuningTriggerFetch,
  } = useFetchPipeline(applicationUID, type1);
  const {
    pipelines: retrainPipelines,
    isLoading: retrainLoading,
    triggerFetch: retrainTriggerFetch,
  } = useFetchPipeline(applicationUID, type2);

  const { handleModelClick } = HandleLinkClick(
    projectNameDecode,
    applicationNameDecode,
    applicationUID
  );

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
            <div className="flex space-x-4 mt-4">
              <div
                className="bg-green-100 text-green-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2"
                onClick={handleModelClick}
              >
                <span>Model</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
              <div className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 ">
                <span>尚未決定</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <button className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl ">
            Upload Optimization Pipeline
          </button>
        </div>
        {/*放card */}
        {tuningLoading && retrainLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {tuningPipelines.map((tunPipe) => (
              <PipelineCard
                key={tunPipe.id}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                pipeline={tunPipe}
                path="optimization_pipeline"
                onEdit={tuningTriggerFetch}
                onDelete={tuningTriggerFetch}
              />
            ))}
            {retrainPipelines.map((retrainPipe) => (
              <PipelineCard
                key={retrainPipe.id}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                pipeline={retrainPipe}
                path="optimization_pipeline"
                onEdit={retrainTriggerFetch}
                onDelete={retrainTriggerFetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
