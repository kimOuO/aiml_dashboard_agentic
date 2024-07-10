import { useEffect ,useState, useMemo } from "react";
import axios from "axios";
import { useFetchProjects } from "../service";

export const useFetchDatasets = (projectId,activeTab,searchQuery,currentPage) => {
    const [dataset, setDatasets] = useState([]);
    const projects = useFetchProjects();
    const [projectName, setProjectName] = useState(null);

    useEffect(()=>{
        if (projectId) {
            const fetchDatasets = async () => {
                try{
                    const response = await axios.get(`/api/projects/${projectId}/datasets/${activeTab}`)
                    setDatasets(response.data);
                }catch(error){
                    console.error("Error fetching datasets:", error);
                }
            }

            fetchDatasets();
        }
    },[projectId, activeTab, searchQuery, currentPage])

    useEffect(()=> {
        if(projects.length>0 && projectId){
            const fetchProjectName = projects.find(proj => proj.id.toString() === projectId)
            setProjectName(fetchProjectName ? fetchProjectName.name : 'Unknown Project')
        }
    },[projects,projectId])

    return {dataset,projectName};
}

//管理dataset動作
export const useDatasetHandlers = () => {
    const [activeTab, setActiveTab] = useState('original');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage,setCurrentPage] = useState(1);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        //當切換tabs時會回到第一頁
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        //當搜尋時會回到第一頁
        setCurrentPage(1);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    return{
        activeTab,
        searchQuery,
        currentPage,
        handleTabClick,
        handleSearchChange,
        handlePageChange,
    };
};

export const useFilteredDatasets = (datasets, searchQuery) => {
    return useMemo(()=>{
        return datasets.filter(dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()))
    },[datasets, searchQuery])
}
