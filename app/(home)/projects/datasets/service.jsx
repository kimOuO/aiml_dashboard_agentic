import { useEffect ,useState, useMemo } from "react";
import axios from "axios";
import { useFetchProjects } from "../service";

export const useFetchDatasets = (projectId,activeTab,searchQuery,currentPage) => {
    const [dataset, setDatasets] = useState([]);
    const {projects, isLoading:projectLoading} = useFetchProjects();
    const [projectName, setProjectName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if (projectId) {
            const fetchDatasets = async () => {
                try{
                    //開始抓取資料，畫面顯示loading
                    setIsLoading(true);
                    const response = await axios.get(`/api/projects/${projectId}/datasets/${activeTab}`)
                    setDatasets(response.data);
                }catch(error){
                    console.error("Error fetching datasets:", error);
                }finally{
                    //結束抓資料，畫面顯示資料
                    setIsLoading(false);
                }
            }

            fetchDatasets();
        }
    },[projectId, activeTab, searchQuery, currentPage])

    useEffect(()=> {
        //抓取projectName
        if(projects.length>0 && projectId){
            const fetchProjectName = projects.find(proj => proj.id.toString() === projectId)
            setProjectName(fetchProjectName ? fetchProjectName.name : 'Unknown Project')
        }
    },[projects,projectId])

    return {dataset,projectName,isLoading};
}

//管理dataset動作
export const useDatasetHandlers = () => {
    const [activeTab, setActiveTab] = useState('original');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage,setCurrentPage] = useState(1);
    const [inputValue, setInputValue] = useState('');

    //tabslist切換
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        //當切換tabs時會回到第一頁
        setSearchQuery('');
        setCurrentPage(1);
    };

    //暫存輸入的text
    const handleSearchChange = (e) => {
        setInputValue(e.target.value);
        //空字串時顯示回所有dataset
        if (e.target.value == '') {
            setSearchQuery('');
        }
    }

    //button被按下後才query
    const handleSearchClick = () => {
        setSearchQuery(inputValue);
        setCurrentPage(1);
    }

    return{
        activeTab,
        searchQuery,
        currentPage,
        inputValue,
        handleTabClick,
        handleSearchChange,
        handleSearchClick,
    };
};

export const useFilteredDatasets = (datasets, searchQuery) => {
    return useMemo(()=>{
        return datasets.filter(dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()))
    },[datasets, searchQuery])
}
