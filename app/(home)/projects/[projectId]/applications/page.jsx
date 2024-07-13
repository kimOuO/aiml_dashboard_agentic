'use client'

import React from "react"
import ApplicationCard from './applicationCard'
import { useParams } from "next/navigation"
import { useFetchApplications } from "./service"

export default function ApplicationPage() {
    const { projectId } = useParams();
    const {applications, projectName, isLoading} = useFetchApplications(projectId);
    return(
        <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p>Project / {projectName}</p>
          <div className="flex items-center">
            <img src="/project/vector_left.svg" className="mr-2" />
            <p className="text-3xl">Applications</p>
          </div>
        </div>
        <button className="bg-green-700 text-white px-4 py-2 rounded-md font-bold">
          Create Application
        </button>
      </div>
          {isLoading ? (
            <div>
              Loading ...
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
      </div>
    </div>
    )
}