"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";
import {
  useRawDataHandlers,
  useFilteredRawDatas,
  RawDatasPagination,
} from "./handleService";
import {
  ModalInput,
  ValidateForm,
  SelectDropdown,
  FileInput,
} from "@/app/modalComponent";
import RawDataCard from "./rawDataCard";
import rawDataList from "/public/raw_data.json";
import { useFetchRawData } from "./service";

export default function RawDataPage() {
  const { projectName, applicationName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");
  const organizationUID = searchParams.get("organizationUID");
  const handleBackClick = useBackNavigation();

  //暫存選擇的過濾條件
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const { rawData, agents, models, isLoading, triggerFetch } = useFetchRawData(
    applicationUID,
    organizationUID
  );

  //過濾rawData、分頁功能
  const {
    searchQuery,
    currentPage,
    inputValue,
    handleSearchChange,
    handleSearchClick,
    handlePageChange,
  } = useRawDataHandlers();

  const { paginatedRawDatas, totalPage } = useFilteredRawDatas(
    rawDataList,
    selectedAgent,
    selectedModel,
    searchQuery,
    currentPage
  );

  //暫存更新的value
  const handleFilterChange = (name, value) => {
    if (name === "agent") {
      setSelectedAgent(value);
    } else if (name === "model") {
      setSelectedModel(value);
    }
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
              <p className="text-3xl">Raw Data</p>
            </div>
          </div>
          <button className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl ">
            Upload Raw Data
          </button>
        </div>
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              className="border p-2 rounded-md mb-4 w-80"
              placeholder="Search"
            />
            <button onClick={handleSearchClick}>
              <img src="/project/search.svg" alt="Search" />
            </button>
          </div>
          {/* 將兩個 SelectDropdown 包在一個 flex 容器中 */}
          <div className="flex items-center gap-2">
            <SelectDropdown
              label="filter_by_model"
              name="model"
              value={selectedModel}
              onChange={(e) => handleFilterChange("model", e.target.value)}
              options={[{ uid: "", name: "ALL" }, ...models]}
            />
            <SelectDropdown
              label="filter_by_agent"
              name="agent"
              value={selectedAgent}
              onChange={(e) => handleFilterChange("agent", e.target.value)}
              options={[{ uid: "", name: "ALL" }, ...agents]}
            />
          </div>
        </div>

        {/* Render RawDataCard for each item */}
        <div className="grid grid-cols-1 gap-6">
          {paginatedRawDatas.map((rawData) => (
            <RawDataCard
              key={rawData.uid}
              rawData={rawData}
              onEdit={() => console.log("Edit:", rawData.uid)}
              onDelete={() => console.log("Delete:", rawData.uid)}
              applicationName={applicationNameDecode}
            />
          ))}
        </div>

        {/* 分頁按鈕顯示 */}
        <RawDatasPagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
