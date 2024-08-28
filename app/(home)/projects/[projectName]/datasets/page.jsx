"use client";

import React from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useFetchDatasets } from "./service";
import { useDatasetHandlers, useFilteredDatasets } from "./handleService";
import DatasetsTabsContent from "./datasetsTabsContent";
import { Tabs } from "@/components/ui/tabs";
import { useBackNavigation } from "@/app/backNavigation";

//dataset頁面內容
const DatasetsPage = ({
  projectName,
  projectUID,
  activeTab,
  inputValue,
  handleTabClick,
  handleSearchChange,
  handleSearchClick,
  filteredDatasets,
  isLoading,
  currentPage,
  totalPage,
  handlePageChange,
  handleBackClick,
  triggerFetch,
}) => {
  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div>
          <p className="text-gray-500">
            Projects /<span className="text-black"> {projectName}</span>
          </p>
        </div>
        <div className="flex items-center mb-6 space-x-4">
          <button onClick={handleBackClick}>
            <img src="/project/vector_left.svg" />
          </button>
          <p className="text-3xl">Dataset</p>
        </div>
        <div className="mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabClick}>
            <DatasetsTabsContent
              activeTab={activeTab}
              inputValue={inputValue}
              handleSearchChange={handleSearchChange}
              handleSearchClick={handleSearchClick}
              filteredDatasets={filteredDatasets}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPage={totalPage}
              handlePageChange={handlePageChange}
              triggerFetch={triggerFetch}
              projectName={projectName}
              projectUID={projectUID}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const { projectName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const searchParams = useSearchParams();
  const projectUID = searchParams.get("projectUID");
  const handleBackClick = useBackNavigation();

  //tab切換、過濾dataset、分頁功能
  const {
    activeTab,
    searchQuery,
    currentPage,
    inputValue,
    handleTabClick,
    handleSearchChange,
    handleSearchClick,
    handlePageChange,
  } = useDatasetHandlers();

  const { dataset, isLoading, triggerFetch } = useFetchDatasets(
    projectUID,
    activeTab,
    searchQuery,
    currentPage
  );

  const { paginatedDatasets, totalPage } = useFilteredDatasets(
    dataset,
    activeTab,
    searchQuery,
    currentPage
  );
  return (
    <DatasetsPage
      projectName={projectNameDecode}
      projectUID={projectUID}
      activeTab={activeTab}
      inputValue={inputValue}
      handleTabClick={handleTabClick}
      handleSearchChange={handleSearchChange}
      handleSearchClick={handleSearchClick}
      filteredDatasets={paginatedDatasets}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPage={totalPage}
      handlePageChange={handlePageChange}
      handleBackClick={handleBackClick}
      triggerFetch={triggerFetch}
    />
  );
}
