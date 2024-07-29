import React from "react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatasetCard from "./datasetCard";
import { DatasetsPagination } from "./handleService";

const TabsContentComponent = ({
  inputValue,
  handleSearchChange,
  handleSearchClick,
  filteredDatasets,
  isLoading,
  currentPage,
  totalPage,
  handlePageChange,
  triggerFetch,
  projectNameDecode,
  tabType,
}) => (
  <TabsContent value={tabType}>
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
          <img src="/project/search.svg" alt="Search" />
        </button>
      </div>
      <button className="text-lg bg-green-700 text-white px-4 py-2 rounded-md">
        {tabType === "original"
          ? "Upload Original Dataset"
          : "Upload Training Dataset"}
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
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              onEdit={triggerFetch}
              onDelete={triggerFetch}
              projectName={projectNameDecode}
            />
          ))}
        </div>
        <DatasetsPagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange}
        />
      </>
    )}
  </TabsContent>
);

const DatasetsTabsContent = ({
  activeTab,
  inputValue,
  handleSearchChange,
  handleSearchClick,
  filteredDatasets,
  isLoading,
  currentPage,
  totalPage,
  handlePageChange,
  triggerFetch,
  projectNameDecode,
}) => {
  return (
    <>
      <TabsList className="flex mb-4">
        <TabsTrigger
          value="original"
          className={` text-lg flex-1 py-3 cursor-pointer text-center rounded-t-lg border-b-2 ${
            activeTab === "original"
              ? "border-blue-400 bg-blue-400 font-bold"
              : "border-gray-400 bg-gray-200"
          }`}
        >
          Original Datasets
        </TabsTrigger>
        <TabsTrigger
          value="training"
          className={`text-lg flex-1 py-3 cursor-pointer text-center rounded-t-lg border-b-2 ${
            activeTab === "training"
              ? "border-blue-400 bg-blue-400 font-bold"
              : "border-gray-400 bg-gray-200 "
          }`}
        >
          Training Datasets
        </TabsTrigger>
      </TabsList>
      <TabsContentComponent
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
        projectNameDecode={projectNameDecode}
        tabType="original"
      />
      <TabsContentComponent
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
        projectNameDecode={projectNameDecode}
        tabType="training"
      />
    </>
  );
};

export default DatasetsTabsContent;
