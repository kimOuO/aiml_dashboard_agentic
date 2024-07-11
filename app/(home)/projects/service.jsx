import React,{useEffect,useState} from "react";
import axios from "axios";

export const useFetchProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading,setIsLoading]= useState(true);

    useEffect(() => {
        const fetchProjects = async() => {
            try{
                //開始抓取資料，畫面顯示loading
                setIsLoading(true);
                const response = await axios.get('/api/projects')
                setProjects(response.data);
            }catch(error){
                console.error("Error fetching projects:", error); 
            }finally{
                //結束抓取資料，畫面顯示資料
                setIsLoading(false)
            }
        }

        fetchProjects();
    }, []);

    return{
        projects,
        isLoading
    };
}