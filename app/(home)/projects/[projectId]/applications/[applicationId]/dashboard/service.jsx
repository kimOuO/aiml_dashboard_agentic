'use client'

import { useEffect,useState } from "react";
import {useFetchProjects} from "../../../../service"
import {useFetchApplications} from "../../service"

export const useFetchProAndAppName = (projectId,applicationId) => {
    const { projects } = useFetchProjects();
    const { applications } = useFetchApplications(projectId);
    const [projectName, setProjectName] = useState(null);
    const [applicationName, setApplicationName] = useState(null);
    useEffect(()=>{
            const findProjectName = () => {
                if (projects.length > 0) {
                    const project = projects.find(proj => proj.id.toString() === projectId)
                    setProjectName(project ? project.name : 'Unknown project')
                }
            }

            const findApplicationName = () => {
                if (applications.length > 0) {
                    const application = applications.find(app => app.id.toString() === applicationId)
                    setApplicationName(application ? application.name : 'Unknown Application')
                }
            }

            findApplicationName();
            findProjectName();

    },[projectId, applicationId,projects,applications])

    return {applicationName,projectName};
}