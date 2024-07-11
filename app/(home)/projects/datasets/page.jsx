'use client'

import React from "react";
import { useSearchParams } from "next/navigation";
import { useFetchDatasets, useDatasetHandlers, useFilteredDatasets} from "./service";
import { DatasetsPagination } from "./service";
import DatasetCard from "./datasetCard";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";


//tabs顯示內容
const DatasetsTabsContent = ({ 
  activeTab, inputValue, handleSearchChange, handleSearchClick, filteredDatasets, isLoading,
  currentPage, totalPage, handlePageChange}) => {
  return (
    <>
      <TabsList className="flex mb-4">
        <TabsTrigger value="original" className={`flex-1 py-2 cursor-pointer text-center rounded-t-lg border-b-2 ${activeTab === 'original' ? 'border-blue-400 bg-blue-400 text-white font-bold' : 'border-gray-300 bg-gray-200 text-black'}`}>
          Original Datasets
        </TabsTrigger>
        <TabsTrigger value="training" className={`flex-1 py-2 cursor-pointer text-center rounded-t-lg border-b-2 ${activeTab === 'training' ? 'border-blue-400 bg-blue-400 text-white font-bold' : 'border-gray-300 bg-gray-200 text-black'}`}>
          Training Datasets
        </TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <div className="flex items-center mb-4 justify-between">
          <div className="items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              className="border p-2 rounded-md mb-4 w-80"
              placeholder="Search"
            />
            <button onClick={handleSearchClick}>
              <img
                src="/project/search.svg" alt="Search"
              />
            </button>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Upload Original Dataset
          </button>
        </div>
        {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading...</p>
        </div>
        ) : (
          <>
            <div className="space-y-4">
            {filteredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
            </div>
            <DatasetsPagination 
              currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange}
            />
          </>
        )}
      </TabsContent>
      <TabsContent value="training">
        <div className="flex items-center mb-4 justify-between">
          <div className="items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              className="border p-2 rounded-md mb-4 w-80"
              placeholder="Search"
            />
            <button onClick={handleSearchClick}>
              <img
                src="/project/search.svg" alt="Search"
              />
            </button>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Upload Training Dataset
          </button>
        </div>
        {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
          {filteredDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
          </div>
          <DatasetsPagination 
            currentPage={currentPage} totalPage={totalPage} onPageChange={handlePageChange}
          />
          
        </>
      )} 
      </TabsContent>
    </>
  );
};

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
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
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