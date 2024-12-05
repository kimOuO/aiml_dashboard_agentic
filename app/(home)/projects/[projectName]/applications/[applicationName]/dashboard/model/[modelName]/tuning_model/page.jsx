"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import { useFilteredTuningModel } from "./handleService";
import { SelectDropdown } from "@/app/modalComponent";
import ModelCard from "./modelCard";
import { useFetchTuningModels } from "./service";

export default function TuningModelPage() {
  const { projectName, applicationName, modelName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const modelNameDecode = decodeURIComponent(modelName);
  const searchParams = useSearchParams();
  const modelSOURCE = searchParams.get("modelSOURCE");
  const modelVERSION = searchParams.get("modelVERSION");
  const organizationUID = searchParams.get("organizationUID");
  const handleBackClick = useBackNavigation();

  //暫存選擇的過濾條件
  const [selectedAgent, setSelectedAgent] = useState("");

  const { models, agents, isLoading, triggerFetch } = useFetchTuningModels(
    modelSOURCE,
    modelVERSION,
    organizationUID
  );

  const filteredTuningModel = useFilteredTuningModel(models, selectedAgent);

  //暫存更新的value
  const handleFilterChange = (name, value) => {
    if (name === "agent") {
      setSelectedAgent(value);
    }
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects / {projectNameDecode} / Applications /{" "}
              {applicationNameDecode} / Models /
              <span className="text-black"> {modelNameDecode}</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" alt="Back" />
              </button>
              <p className="text-3xl">Tuning Model</p>
            </div>
          </div>
          <button className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl ">
            Upload Raw Data
          </button>
        </div>
        <div className="flex items-center mb-4">
          <div className="ml-auto">
            <SelectDropdown
              label="filter_by_agent"
              name="agent"
              value={selectedAgent}
              onChange={(e) => handleFilterChange("agent", e.target.value)}
              options={[{ uid: "", name: "ALL" }, ...agents]}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTuningModel.map((tuningModel) => (
              <ModelCard
                key={tuningModel.uid}
                model={tuningModel}
                onEdit={triggerFetch}
                onDelete={triggerFetch}
                applicationName={applicationNameDecode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
