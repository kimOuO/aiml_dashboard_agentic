"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { useFetchTask } from "../../../preprocessing_pipeline/[prePipeName]/tasks/service";
import { HandleLinkClick, useFetchTaskFile } from "./service";
import { TaskCard } from "../../../training_pipeline/[trainPipeName]/tasks/taskCard";
import { CreateModal } from "./taskModal";
import { TaskMonitoringProvider } from "@/contexts/TaskMonitoringContext";
import TaskMonitoringControls from "@/components/ui/task-monitoring-controls";

export default function TrainingTaskPage() {
  const { projectName, applicationName, trainPipeName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const trainPipeNameDecode = decodeURIComponent(trainPipeName);
  const searchParams = useSearchParams();
  const pipelineUID = searchParams.get("pipelineUID");

  const handleBackClick = useBackNavigation();
  const {
    tasks: trainingTasks,
    isLoading,
    triggerFetch,
  } = useFetchTask(pipelineUID);

  const taskFile = useFetchTaskFile(pipelineUID);

  const { handleBuildFileClick, handleConfigClick } = HandleLinkClick(
    projectNameDecode,
    applicationNameDecode,
    trainPipeNameDecode,
    pipelineUID
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <TaskMonitoringProvider>
      <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-500">
                Projects / {projectNameDecode} / Applications /{" "}
                {applicationNameDecode} / Training Pipeline /
                <span className="text-black"> {trainPipeNameDecode} </span>
              </p>
              <div className="flex items-center mb-6 space-x-4">
                <button onClick={handleBackClick}>
                  <img src="/project/vector_left.svg" alt="Back" />
                </button>
                <p className="text-3xl">Tasks</p>
              </div>
              <div className="flex space-x-4 mt-4">
                <div
                  className="bg-green-100 text-green-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2"
                  onClick={handleBuildFileClick}
                >
                  <span>Build File</span>
                  <img
                    src="/project/external-link.svg"
                    alt="External Link"
                    className="w-4 h-4"
                  />
                </div>
                <div
                  className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 "
                  onClick={handleConfigClick}
                >
                  <span>Config</span>
                  <img
                    src="/project/external-link.svg"
                    alt="External Link"
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <TaskMonitoringControls />
              <button
                className="bg-green-800 text-white px-4 py-3 rounded-2xl text-xl "
                onClick={handleCreateClick}
              >
                Run Training Task
              </button>
            </div>
          </div>
          {/*放card */}
          {isLoading ? (
            <div>Loading ...</div>
          ) : (
            <div className="space-y-4">
              {trainingTasks.map((trainTask) => (
                <TaskCard
                  key={trainTask.uid}
                  task={trainTask}
                  pipelineName={trainPipeNameDecode}
                  onEdit={triggerFetch}
                  onDelete={triggerFetch}
                  type="training"
                  pipelineUID={pipelineUID}
                />
              ))}
            </div>
          )}
        </div>
        {isCreateModalOpen && (
          <CreateModal
            pipelineUID={pipelineUID}
            pipelineName={trainPipeNameDecode}
            type="Training"
            onCreate={triggerFetch}
            onClose={handleCloseCreateModal}
            taskFile={taskFile}
          />
        )}
      </div>
    </TaskMonitoringProvider>
  );
}
