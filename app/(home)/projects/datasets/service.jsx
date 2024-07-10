import { useEffect,useState } from "react";
import axios from "axios";

export const useFetchDatasets = (projectId,tab,query,page) => {
    const [dataset, setDatasets] = useState([]);

    useEffect(()=>{
        if (projectId) {
            axios.get(`/api//projects/${projectId}/datasets`,{
                params:{
                    type: tab,
                    search: query,
                    page: page
                }
            })
                .then(response => {
                    setDatasets(response.data);
                })
                .catch(error=>{
                    console.error('There was an error fetching the datasets!', error);
                })
        }
    },[projectId,tab,query,page])

    return dataset;
}

export const useDatasetHandlers = () => {
    const [activeTab, setActiveTab] = useState('original');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage,setCurrentPage] = useState(1);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        //當切換tabs時會回到第一頁
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
