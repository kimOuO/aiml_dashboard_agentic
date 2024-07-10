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
    <div className="min-h-screen bg-gray-50 pt-32 p-6">
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-6">Datasets for Project {projectId}</h1>
        </div>
        <Tabs selectedIndex={activeTab === 'original'? 0:1} onSelect={(index) => handleTabClick(index === 0 ? 'original' : 'training')}>
          <TabList>
            <Tab>Original Datasets</Tab>
            <Tab>Training Datasets</Tab>
          </TabList>
          <TabPanel>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border p-2 rounded-md mb-4"
              placeholder="Search"
            />
            <button>
              Upload Original Dataset
            </button>
            <div className="space-y-4">
              {datasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border p-2 rounded-md mb-4"
              placeholder="Search"
            />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default DatasetsPage;
