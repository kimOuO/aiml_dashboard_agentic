"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import ApplicationDashboard from "./dashboardCard";
import { useBackNavigation } from "@/app/backNavigation";

export default function DashboardPage() {
  const { projectName, applicationName } = useParams();
  const proejectNameDecode = decodeURIComponent(projectName);
  const applicationNameDecode = decodeURIComponent(applicationName);
  const searchParams = useSearchParams();
  const applicationUID = searchParams.get("applicationUID");
  const handleBackClick = useBackNavigation();

  return (
    <div className="mx-auto min-h-screen bg-gray-50 pt-32 px-40">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">
              Projects / {proejectNameDecode} /{" "}
              <span className="text-black">Applications</span>
            </p>
            <div className="flex items-center mb-6 space-x-4">
              <button onClick={handleBackClick}>
                <img src="/project/vector_left.svg" />
              </button>
              <p className="text-3xl">{applicationNameDecode}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <ApplicationDashboard
            projectName={proejectNameDecode}
            applicationName={applicationNameDecode}
            applicationUID={applicationUID}
          />
        </div>
      </div>
    </div>
  );
}
