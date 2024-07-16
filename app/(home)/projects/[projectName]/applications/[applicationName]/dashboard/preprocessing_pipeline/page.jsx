"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useBackNavigation } from "@/app/backNavigation";

export default function ModelPage() {
  const { projectName, applicationName } = useParams();
  const handleBackClick = useBackNavigation();
  const proejectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects / {proejectNameDecode} / Applications /
              <span className="text-black"> {applicationNameDecode}</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" alt="Back" />
              </button>
              <p className="text-3xl">Preprocessing Pipeline</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <div className="bg-green-100 text-green-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2">
                <span>Training Pipeline</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
              <div className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-md cursor-pointer flex items-center space-x-2 ">
                <span>Models</span>
                <img
                  src="/project/external-link.svg"
                  alt="External Link"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <button className="bg-green-800 text-white px-6 py-4 rounded-2xl text-xl ">
            Upload Preprocessing Pipeline
          </button>
        </div>
        {/*放modelcard */}
      </div>
    </div>
  );
}
