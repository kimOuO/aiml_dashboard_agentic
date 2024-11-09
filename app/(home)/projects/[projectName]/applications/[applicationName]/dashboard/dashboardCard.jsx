import React from "react";
import { useRouter } from "next/navigation";

export default function ApplicationDashboard({
  projectName,
  applicationName,
  applicationUID,
}) {
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

  const handleTrainingPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/training_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleOptimizationDatasetsClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/optimization_datasets?applicationUID=${applicationUID}`
    );
  };

  const handleOptimizationPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/optimization_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleEvaluationPipelineClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/evaluation_pipeline?applicationUID=${applicationUID}`
    );
  };

  const handleRawDataClick = () => {
    router.push(
      `/projects/${projectName}/applications/${applicationName}/dashboard/raw_data?applicationUID=${applicationUID}`
    )
  }

  return (
    <div className="space-y-10">
      <div
        className="relative bg-blue-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-blue-300 "
        onClick={handleModelClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Model</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
      <div
        className="relative bg-orange-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-orange-300"
        onClick={handlePreprocessingPipelineClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Preprocessing Pipeline</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
      <div
        className="relative bg-green-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-green-300"
        onClick={handleTrainingPipelineClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Training Pipeline</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
      <div
        className="relative bg-purple-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-purple-300"
        onClick={handleOptimizationDatasetsClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Optimization Datasets</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
      <div
        className="relative bg-indigo-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-indigo-300"
        onClick={handleOptimizationPipelineClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Optimization Pipeline</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
      <div
        className="relative bg-red-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-red-300"
        onClick={handleEvaluationPipelineClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Evaluation Pipeline</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
      <div
        className="relative bg-yellow-100 shadow-md rounded-lg p-4 flex justify-between items-center cursor-pointer border-2 border-yellow-300"
        onClick={handleRawDataClick}
      >
        <div className="flex space-x-4">
          <h2 className=" text-xl font-semibold p-1">Raw Data</h2>
          <span className="text-2xl font-bold">→</span>
        </div>
      </div>
    </div>
  );
}
