"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { useFetchPipeline, HandleLinkClick } from "./service";
import { PipelineCard } from "./pipelineCard";
import { CreateModal } from "./pipelineModal";

export default function PreprocessingPipelinePage() {
  const { projectName, applicationName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const handleBackClick = useBackNavigation();
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");
  const type = "preprocessing";

  const {
    pipelines: preprocessingpipelines,
    isLoading,
    triggerFetch,
  } = useFetchPipeline(applicationUID, type);

  const { handleTrainingPipelineClick, handleModelClick } = HandleLinkClick(
    projectNameDecode,
    applicationNameDecode,
    applicationUID
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-10 pt-32 px-40">
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
              <p className="text-3xl">Preprocessing Pipeline</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <div
                className="bg-green-100 text-green-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2"
                onClick={handleTrainingPipelineClick}
              >
                <span>Training Pipeline</span>
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
                <span>Models</span>
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
            Upload Preprocessing Pipeline
          </button>
        </div>
        {/*放card */}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {preprocessingpipelines.map((prePipe) => (
              <PipelineCard
                key={prePipe.uid}
                projectName={projectNameDecode}
                applicationName={applicationNameDecode}
                pipeline={prePipe}
                path="preprocessing_pipeline"
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
