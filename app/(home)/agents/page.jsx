"use client";

import React, { useState } from "react";
import { useFetchAgents, useFetchOrganization } from "./service";
import { useSearchParams } from "next/navigation";
import { CreateModal } from "./agentModal";
import AgnetCard from "./agentCard";

export default function AgentPage() {
  const searchParams = useSearchParams();
  const organizationUID = searchParams.get("organizationUID");
  const { agents, isLoading, triggerFetch } =
    useFetchAgents(organizationUID);
  const organization = useFetchOrganization(organizationUID);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Agents</h1>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
            onClick={handleCreateClick}
          >
            Create Agent
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <AgnetCard
                key={agent.uid}
                agent={agent}
                onEdit={triggerFetch}
                onDelete={triggerFetch}
                organization={organization}
              />
            ))}
          </div>
        )}
      </div>
      {isCreateModalOpen && (
        <CreateModal
          organization={organization}
          onClose={handleCloseCreateModal}
          onCreate={triggerFetch}
        />
      )}
    </div>
  );
}
