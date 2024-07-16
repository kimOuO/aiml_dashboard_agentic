"use client";

import React from "react";
import { useParams } from "next/navigation";
import ModelCard from "./modelCard";
import { useFetchModels, handleLinkClick } from "./service";
import { useBackNavigation } from "@/app/backNavigation";

export default function ModelPage() {
  const { projectName, applicationName } = useParams();
  const handleBackClick = useBackNavigation();
  const proejectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const { models, isLoading } = useFetchModels(
    proejectNameDecode,
    applicationNameDecode
  );
  const { handlePreprocessingPipelineClick, handleTrainingPipelineClick } =
    handleLinkClick(proejectNameDecode, applicationNameDecode);
  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects / {proejectNameDecode} / Applications /
              <span className="text-black"> {applicationNameDecode}</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" alt="Back" />
              </button>
              <p className="text-3xl">Models</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <div
                className="bg-red-100 text-red-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2"
                onClick={handlePreprocessingPipelineClick}
              >
                <span>Preprocessing Pipeline</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
              <div
                className="bg-green-100 text-green-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 "
                onClick={handleTrainingPipelineClick}
              >
                <span>Training Pipeline</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <button className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl ">
            Upload Model
          </button>
        </div>
        {/*放modelcard */}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                projectName={proejectNameDecode}
                applicationName={applicationNameDecode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
