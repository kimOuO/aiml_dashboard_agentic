"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  useFetchDatasets,
  useDatasetHandlers,
  useFilteredDatasets,
} from "./service";
import DatasetsTabsContent from "./datasetsTabsContent";
import { Tabs } from "@/components/ui/tabs";
import { useBackNavigation } from "@/app/backNavigation";

//dataset頁面內容
const DatasetsPage = ({
  projectName,
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
              handleTabClick={handleTabClick}
              handleSearchChange={handleSearchChange}
              handleSearchClick={handleSearchClick}
              filteredDatasets={filteredDatasets}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPage={totalPage}
              handlePageChange={handlePageChange}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { projectName } = useParams();
  const handleBackClick = useBackNavigation();
  const projectNameDecode = decodeURIComponent(projectName);
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
  const { dataset, isLoading } = useFetchDatasets(
    projectName,
    activeTab,
    searchQuery,
    currentPage
  );
  const { paginatedDatasets, totalPage } = useFilteredDatasets(
    dataset,
    searchQuery,
    currentPage
  );
  return (
    <DatasetsPage
      projectName={projectNameDecode}
      activeTab={activeTab}
      searchQuery={searchQuery}
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
    />
  );
};

export default Page;
