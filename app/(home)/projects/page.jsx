"use client";

import React, { useState } from "react";
import { useFetchProjects, useFetchOrganization } from "./service";
import { CreateModal } from "./projectModal";
import ProjectCard from "./projectCard";

export default function ProjectPage() {
  const { projects, isLoading, triggerFetch } = useFetchProjects();
  const organization = useFetchOrganization();

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
          <h1 className="text-2xl font-bold">Projects</h1>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md font-bold"
            onClick={handleCreateClick}
          >
            Create Project
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={triggerFetch}
                onDelete={triggerFetch}
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
