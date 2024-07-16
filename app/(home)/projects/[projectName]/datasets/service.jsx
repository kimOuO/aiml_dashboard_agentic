import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const useFetchDatasets = (
  projectName,
  activeTab,
  searchQuery,
  currentPage
) => {
  const [dataset, setDatasets] = useState([]);
  //判斷dataset是否還在抓取資料
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectName) {
      const fetchDatasets = async () => {
        try {
          //開始抓取資料，畫面顯示loading
          setIsLoading(true);
          const response = await axios.get(
            `/api/projects/${projectName}/datasets/${activeTab}`
          );
          setDatasets(response.data);
        } catch (error) {
          console.error("Error fetching datasets:", error);
        } finally {
          //結束抓資料，畫面顯示資料
          setIsLoading(false);
        }
      };

      fetchDatasets();
    }
  }, [projectName, activeTab, searchQuery, currentPage]);

  return { dataset, isLoading };
};

//管理dataset動作
export const useDatasetHandlers = () => {
  const [activeTab, setActiveTab] = useState("original");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  //tabslist切換
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    //tabs切換會清除搜尋字串
    setSearchQuery("");
    //當切換tabs時會回到第一頁
    setCurrentPage(1);
  };

  //暫存輸入的text
  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
    //空字串時顯示所有dataset
    if (e.target.value == "") {
      setSearchQuery("");
    }
  };

  //button被按下後才query
  const handleSearchClick = () => {
    setSearchQuery(inputValue);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return {
    activeTab,
    searchQuery,
    currentPage,
    inputValue,
    handleTabClick,
    handleSearchChange,
    handleSearchClick,
    handlePageChange,
  };
};

export const useFilteredDatasets = (datasets, searchQuery, currentPage) => {
  //搜尋以過濾dataset功能
  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [datasets, searchQuery]);

  //每頁顯示之dataset數量
  const datasetsPerPage = 5;
  const totalPage = Math.ceil(filteredDatasets.length / datasetsPerPage);
  //每個頁面要顯示哪一些dataset
  const paginatedDatasets = filteredDatasets.slice(
    (currentPage - 1) * datasetsPerPage,
    currentPage * datasetsPerPage
  );

  return { paginatedDatasets, totalPage };
};

export const DatasetsPagination = ({
  currentPage,
  totalPage,
  onPageChange,
}) => {
  return (
    totalPage > 1 && (
      <div className="flex justify-center mt-4">
        <Pagination className="space-x-2">
          {currentPage > 1 && (
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className="transition duration-300 ease-in-out transform hover:-translate-x-1 hover:scale-105"
            >
              Provious
            </PaginationPrevious>
          )}
          <PaginationContent className="flex space-x-2">
            {Array.from({ length: totalPage }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  active={currentPage === i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`transition duration-300 ease-in-out transform hover:scale-105 ${
                    currentPage === i + 1
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          {currentPage < totalPage && (
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className="transition duration-300 ease-in-out transform hover:translate-x-1 hover:scale-105"
            >
              Next
            </PaginationNext>
          )}
        </Pagination>
      </div>
    )
  );
};
