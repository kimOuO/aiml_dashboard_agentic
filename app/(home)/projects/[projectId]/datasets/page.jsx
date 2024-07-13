'use client'

import React from "react";
import { useParams } from "next/navigation";
import { useFetchDatasets, useDatasetHandlers, useFilteredDatasets} from "./service";
import DatasetsTabsContent from './datasetsTabsContent'
import {Tabs} from "@/components/ui/tabs";


//dataset頁面內容
const DatasetsPage = ({ 
  projectName, activeTab, inputValue, handleTabClick, handleSearchChange, handleSearchClick, 
  filteredDatasets, isLoading, currentPage, totalPage, handlePageChange }) => {
  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div>
          <p>Project / {projectName}</p>
        </div>
        <div className="flex items-center mb-6">
          <button>
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
  const { projectId } = useParams();
  const { activeTab, searchQuery, currentPage, inputValue, handleTabClick, handleSearchChange, handleSearchClick, handlePageChange } = useDatasetHandlers();
  const { dataset, projectName, isLoading } = useFetchDatasets(projectId, activeTab, searchQuery, currentPage);
  const {paginatedDatasets, totalPage} = useFilteredDatasets(dataset, searchQuery,currentPage);
  return (
    <DatasetsPage
      projectName={projectName}
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
    />
  );
};

export default Page;