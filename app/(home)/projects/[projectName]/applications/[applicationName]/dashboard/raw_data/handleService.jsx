import { useEffect, useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

//管理dataset動作
export const useDatasetHandlers = () => {
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

//搜尋以過濾dataset功能
export const useFilteredDatasets = (datasets, searchQuery, currentPage) => {
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

//dataset分頁邏輯
export const DatasetsPagination = ({
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
