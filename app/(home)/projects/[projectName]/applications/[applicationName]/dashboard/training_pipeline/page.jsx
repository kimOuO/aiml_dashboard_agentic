"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { HandleLinkClick } from "./service";
import { useFetchPipeline } from "../preprocessing_pipeline/service";
import { PipelineCard } from "../preprocessing_pipeline/pipelineCard";
import { CreateModal } from "../preprocessing_pipeline/pipelineModal";

export default function TrainingPipelinePage() {
  const { projectName, applicationName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");

  const handleBackClick = useBackNavigation();
  const type = "Training";

  const {
    pipelines: trainingPipelines,
    isLoading,
    triggerFetch,
  } = useFetchPipeline(applicationUID, type);
  const { handleModelClick, handlePreprocessingPipelineClick } =
    HandleLinkClick(projectNameDecode, applicationNameDecode, applicationUID);

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
              <p className="text-3xl">Training Pipeline</p>
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
              <div
                className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 "
                onClick={handlePreprocessingPipelineClick}
              >
                <span>Preprocessing Pipeline</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <button
            className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl "
            onClick={handleCreateClick}
          >
            Upload Training Pipeline
          </button>
        </div>
        {/*放card */}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {trainingPipelines.map((traPipe) => (
              <PipelineCard
                key={traPipe.uid}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                pipeline={traPipe}
                path="training_pipeline"
                onEdit={triggerFetch}
                onDelete={triggerFetch}
              />
            ))}
          </div>
        )}
      </div>
      {isCreateModalOpen && (
        <CreateModal
          applicationUID={applicationUID}
          applicationName={applicationNameDecode}
          type={type}
          onCreate={triggerFetch}
          onClose={handleCloseCreateModal}
        />
      )}
    </div>
  );
}
