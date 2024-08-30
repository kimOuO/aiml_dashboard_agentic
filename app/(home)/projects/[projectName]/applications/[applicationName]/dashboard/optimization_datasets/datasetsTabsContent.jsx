import React, { useState } from "react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatasetCard from "./datasetCard";
import { CreateModal } from "./datasetModal";
import { DatasetsPagination } from "./handleService";

const TabsContentComponent = ({
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
  applicationName,
  handleOpenModal,
}) => (
  <TabsContent value={activeTab}>
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
      <button
        className="text-lg bg-green-700 text-white px-4 py-2 rounded-md"
        //傳遞activeTab確認當前標籤頁
        onClick={() => handleOpenModal(activeTab)}
      >
        {activeTab === "Original"
          ? "Upload Original Dataset"
          : "Upload Optimization Dataset"}
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
              key={dataset.uid}
              dataset={dataset}
              onEdit={triggerFetch}
              onDelete={triggerFetch}
              applicationName={applicationName}
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
  applicationName,
  applicationUID,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTabType, setModalTabType] = useState("Original");
  //打開modal
  const handleOpenModal = (activeTab) => {
    setModalTabType(activeTab);
    setIsModalOpen(true);
  };
  //關閉modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <TabsList className="flex mb-4">
        <TabsTrigger
          value="Original"
          className={` text-lg flex-1 py-3 cursor-pointer text-center rounded-t-lg border-b-2 ${
            activeTab === "Original"
              ? "border-blue-400 bg-blue-400 font-bold"
              : "border-gray-400 bg-gray-200"
          }`}
        >
          Original Datasets
        </TabsTrigger>
        <TabsTrigger
          value="Optimization"
          className={`text-lg flex-1 py-3 cursor-pointer text-center rounded-t-lg border-b-2 ${
            activeTab === "Optimization"
              ? "border-blue-400 bg-blue-400 font-bold"
              : "border-gray-400 bg-gray-200 "
          }`}
        >
          Optimization Datasets
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
        applicationName={applicationName}
        applicationUID={applicationUID}
        handleOpenModal={handleOpenModal}
      />
      {/*渲染CreateModal*/}
      {isModalOpen && (
        <CreateModal
          applicationUID={applicationUID}
          applicationName={applicationName}
          activeTab={modalTabType}
          onClose={handleCloseModal}
          onCreate={triggerFetch} //新增後刷新頁面
        />
      )}
    </>
  );
};

export default DatasetsTabsContent;
