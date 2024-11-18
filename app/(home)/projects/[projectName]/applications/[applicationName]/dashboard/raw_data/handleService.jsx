import { useEffect, useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

//管理rawData動作
export const useRawDataHandlers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

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
    searchQuery,
    currentPage,
    inputValue,
    handleSearchChange,
    handleSearchClick,
    handlePageChange,
  };
};

//搜尋以過濾rawData功能
export const useFilteredRawDatas = (
  rawDatas,
  selectedAgent,
  selectedModel,
  searchQuery,
  currentPage
) => {
  const filteredRawDatas = useMemo(() => {
    return rawDatas.filter((rawData) => {
      //過濾條件
      const matchSearchQuery = rawData.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchAgent =
        !selectedAgent || rawData.f_agent_uid === selectedAgent;
      const matchModel =
        !selectedModel || rawData.f_model_uid === selectedModel;

      //同時符合search、agent filter、model filter
      return matchSearchQuery && matchAgent && matchModel;
    });
  }, [rawDatas, searchQuery, selectedAgent, selectedModel]);

  //每頁顯示之rawData數量
  const rawDatasPerPage = 5;
  const totalPage = Math.ceil(filteredRawDatas.length / rawDatasPerPage);
  //每個頁面要顯示哪一些rawData
  const paginatedRawDatas = filteredRawDatas.slice(
    (currentPage - 1) * rawDatasPerPage,
    currentPage * rawDatasPerPage
  );

  return { paginatedRawDatas, totalPage };
};

//rawdata分頁邏輯
export const RawDatasPagination = ({
  currentPage,
  totalPage,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    if (totalPage <= 5) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPage];
    }
    if (currentPage >= totalPage - 2) {
      return [1, "...", totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPage,
    ];
  };

  const pageNumbers = generatePageNumbers();

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
            {pageNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {typeof page === "number" ? (
                  <PaginationLink
                    active={currentPage === page}
                    onClick={() => onPageChange(page)}
                    className={`transition duration-300 ease-in-out transform hover:scale-105 ${
                      currentPage === page
                        ? "bg-gray-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                ) : (
                  <span className="px-3 py-2 text-gray-500">...</span>
                )}
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
