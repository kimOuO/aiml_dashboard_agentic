"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { useFetchPipeline } from "../preprocessing_pipeline/service";
import { PipelineCard } from "./pipelineCard";
import { CreateModal } from "./pipelineModal";

export default function OptimizationPipelinePage() {
  const { projectName, applicationName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");
  const organizationUID = searchParams.get("organizationUID");

  const handleBackClick = useBackNavigation();

  const {
    pipelines: retrainPipelines,
    isLoading: retrainLoading,
    triggerFetch: retrainTrigger,
  } = useFetchPipeline(applicationUID, "retrain");

  const {
    pipelines: tuningPipelines,
    isLoading: tuningLoading,
    triggerFetch: tuningTrigger,
  } = useFetchPipeline(applicationUID, "tuning");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

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
          <button
            className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl "
            onClick={handleCreateClick}
          >
            Upload Optimization Pipeline
          </button>
        </div>
        {/*放card */}
        {retrainLoading && tuningLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {retrainPipelines.map((retrainPipe) => (
              <PipelineCard
                key={retrainPipe.uid}
                pipelineType={retrainPipe.type}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                organizationUID={organizationUID}
                pipeline={retrainPipe}
                path="optimization_pipeline"
                onEdit={retrainTrigger}
                onDelete={retrainTrigger}
              />
            ))}
            {tuningPipelines.map((tunPipe) => (
              <PipelineCard
                key={tunPipe.uid}
                pipelineType={tunPipe.type}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                organizationUID={organizationUID}
                pipeline={tunPipe}
                path="optimization_pipeline"
                onEdit={tuningTrigger}
                onDelete={tuningTrigger}
              />
            ))}
          </div>
        )}
      </div>
      {isCreateModalOpen && (
        <CreateModal
          applicationUID={applicationUID}
          applicationName={applicationNameDecode}
          onCreateRetain={retrainTrigger}
          onCreateTuning={tuningTrigger}
          onClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
}
