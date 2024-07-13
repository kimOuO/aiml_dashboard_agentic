'use client'

import { useEffect,useState,useMemo } from "react";
import axios from "axios";
import { useFetchProjects } from "../service";

export const useFetchApplications = (projectId)=>{
    const [applications,setApplications] = useState([]);
    const { projects } = useFetchProjects();
    const [projectName,setProjectName] = useState(null);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        if(projectId) {
            const fetchApplications = async() => {
                try{
                    //開始抓取資料，畫面顯示loading
                    setIsLoading(true);
                    const response = await axios.get(`/api/projects/${projectId}/applications`);
                    setApplications(response.data);
                }catch(error){
                    console.error("Error fetching applications:", error);
                }finally{
                    //結束抓資料，畫面顯示資料
                    setIsLoading(false);
                }
            };

            const findProjectName = () => {
                if (projects.length > 0) {
                    const project = projects.find(proj => proj.id.toString() === projectId)
                    setProjectName(project ? project.name : 'Unknown project')
                }
            }
            fetchApplications();
            findProjectName();
        }
    },[projectId,projects])

    return {applications,projectName,isLoading};
}