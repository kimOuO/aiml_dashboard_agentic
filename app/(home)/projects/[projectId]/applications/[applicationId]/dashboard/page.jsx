'use client'

import React from "react"
import { useParams } from "next/navigation"
import ApplicationDashboard from "./dashboardCard"
import {useFetchProAndAppName} from "./service"

export default function DashboardPage() {
    const {projectId, applicationId} = useParams();
    const {projectName, applicationName} = useFetchProAndAppName(projectId,applicationId);
    
    return(
        <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-gray-500">Projects / {projectName} / <span className="text-black">Applications</span></p>
                <div className="flex items-center">
                <img src="/project/vector_left.svg" className="mr-2" />
                <p className="text-3xl">{applicationName}</p>
                </div>
            </div>
        </div>
      <div className="space-y-4">
        <ApplicationDashboard
            projectId={projectId}
            applicationId={applicationId}
        />
      </div>
      </div>
    </div>
    )
}