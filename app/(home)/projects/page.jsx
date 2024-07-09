"use client";

import React from "react";
import { useFethProjects } from './service'
import ProjectCard from './projectCard'

export default function ProjectPage() {
  const projects = useFethProjects();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Create Project
          </button>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}