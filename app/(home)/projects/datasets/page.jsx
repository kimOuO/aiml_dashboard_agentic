'use client'

import React from "react";
import { useSearchParams } from "next/navigation";
import { useFetchDatasets,useDatasetHandlers} from "./service";
import DatasetCard from "./datasetCard";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import 'react-tabs/style/react-tabs.css';


const DatasetsPage = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const {activeTab,searchQuery,currentPage,handleTabClick,handleSearchChange,handlePageChange} = useDatasetHandlers();
  const datasets = useFetchDatasets(projectId,activeTab,searchQuery,currentPage);


  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 p-6" style={{ maxWidth: '1000px' }}>
      <div>
        <div>
          <p>Project / {projectId}</p>
        </div>
        <div className="flex items-center mb-6">
          <button>
            <img src="/project/vector_left.svg"/>
          </button>
          <p className="text-3xl">Dataset</p>
        </div>
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
          <Tabs selectedIndex={activeTab === 'original'? 0:1} onSelect={(index) => handleTabClick(index === 0 ? 'original' : 'training')}>
            <TabList className="flex mb-4">
              <Tab 
                className="flex-1 px-4 py-2 cursor-pointer text-center rounded-t-lg border-b-2 border-gray-300 bg-gray-100 text-black outline-none"
                selectedClassName="bg-blue-500 text-white border-blue-500"
              >
                Original Datasets
              </Tab >
              <Tab 
                className="flex-1 px-4 py-2 cursor-pointer text-center rounded-t-lg border-b-2 border-gray-300 bg-gray-100 text-black outline-none"
                selectedClassName="bg-blue-500 text-white border-blue-500"
              >
                Training Datasets
              </Tab>
            </TabList>
            <TabPanel>
              <div className="flex items-center mb-4 justify-between">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border p-2 rounded-md mb-4"
                  placeholder="Search"
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Upload Original Dataset
                </button>
              </div>
              <div className="space-y-4">
                {datasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="flex items-center mb-4 justify-between">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border p-2 rounded-md mb-4"
                  placeholder="Search"
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Upload Training Dataset
                </button>
              </div>
              <div className="space-y-4">
                {datasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
              </div>
            </TabPanel>
          </Tabs>  
        </div>
      </div>
    </div>
  );
};

export default DatasetsPage;
