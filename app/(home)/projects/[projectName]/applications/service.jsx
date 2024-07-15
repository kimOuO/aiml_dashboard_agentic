'use client'

import { useEffect,useState } from "react";
import axios from "axios";

export const useFetchApplications = (projectName)=>{
    const [applications,setApplications] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        if(projectName) {
            const fetchApplications = async() => {
                try{
                    //開始抓取資料，畫面顯示loading
                    setIsLoading(true);
                    const response = await axios.get(`/api/projects/${projectName}/applications`);
                    setApplications(response.data);
                }catch(error){
                    console.error("Error fetching applications:", error);
                }finally{
                    //結束抓資料，畫面顯示資料
                    setIsLoading(false);
                }
            };

            fetchApplications();
        }
    },[projectName])

    return {applications,isLoading};
}