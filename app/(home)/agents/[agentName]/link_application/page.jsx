"use client";

import React, { useState } from "react";
import ApplicationCard from "./linkapplicationCard";
import { useParams, useSearchParams } from "next/navigation";
import { useFetchAgentApplications } from "./service";
import { useBackNavigation } from "@/app/backNavigation";

export default function ApplicationPage() {
  const { agentName } = useParams();
  const agentNameDecode = decodeURIComponent(agentName);
  const searchParams = useSearchParams();
  const agentUID = searchParams.get("agentUID");

  const handleBackClick = useBackNavigation();
  const { applications, isLoading, triggerFetch } =
    useFetchAgentApplications(agentUID);

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
              Agents /<span className="text-black"> {agentNameDecode}</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" />
              </button>
              <p className="text-3xl">Link Applications</p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <div className="space-y-4">
            {applications &&
              applications.map((application) => (
                <ApplicationCard
                  agentUID={agentUID}
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
          projectName={agentNameDecode}
          projectUID={agentUID}
          onClose={handleCloseCreateModal}
          onCreate={triggerFetch}
        />
      )}
    </div>
  );
}
