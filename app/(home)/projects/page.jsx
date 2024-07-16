"use client";

import React from "react";
import { useFetchProjects } from "./service";
import ProjectCard from "./projectCard";

export default function ProjectPage() {
  const { projects, isLoading } = useFetchProjects();

  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <button className="bg-green-700 text-white px-4 py-2 rounded-md font-bold">
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
