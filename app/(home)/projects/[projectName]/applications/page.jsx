"use client";

import React, { useState } from "react";
import ApplicationCard from "./applicationCard";
import { useParams, useSearchParams } from "next/navigation";
import { useFetchApplications } from "./service";
import { useBackNavigation } from "@/app/backNavigation";
import { CreateModal } from "./applicationModal";

export default function ApplicationPage() {
  const { projectName } = useParams();
  const projectNameDecode = decodeURIComponent(projectName);
  const searchParams = useSearchParams();
  const projectUID = searchParams.get("projectUID");
  const organizationUID = searchParams.get("organizationUID");

  const handleBackClick = useBackNavigation();
  const { applications, isLoading, triggerFetch } =
    useFetchApplications(projectUID);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects /<span className="text-black"> {projectNameDecode}</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" />
              </button>
              <p className="text-3xl">Applications</p>
            </div>
          </div>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
            onClick={handleCreateClick}
          >
            Create Application
          </button>
        </div>
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                projectName={projectNameDecode}
                organizationUID={organizationUID}
                key={application.uid}
                application={application}
                onEdit={triggerFetch}
                onDelete={triggerFetch}
              />
            ))}
          </div>
        )}
      </div>
      {isCreateModalOpen && (
        <CreateModal
          projectName={projectNameDecode}
          projectUID={projectUID}
          onClose={handleCloseCreateModal}
          onCreate={triggerFetch}
        />
      )}
    </div>
  );
}
