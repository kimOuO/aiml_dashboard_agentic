import { useEffect, useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

//選擇agent以過濾tuning model功能
export const useFilteredTuningModel = (tuningModel, selectedAgent) => {
  const filteredTuningModel = useMemo(() => {
    return tuningModel.filter((tuningModel) => {
      //過濾條件
      const matchAgent =
        !selectedAgent || tuningModel.f_agent_uid === selectedAgent;

      return matchAgent;
    });
  }, [tuningModel, selectedAgent]);

  return filteredTuningModel;
};
