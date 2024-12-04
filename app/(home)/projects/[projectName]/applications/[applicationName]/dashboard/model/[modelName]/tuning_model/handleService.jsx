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
  // 使用 useMemo 過濾 tuningModel，當 tuningModel 或 selectedAgent 改變時重新計算
  const filteredTuningModel = useMemo(() => {
    // 若 tuningModel 是 undefined 或空陣列，直接返回空陣列
    if (!Array.isArray(tuningModel) || tuningModel.length === 0) {
      return [];
    }

    // 過濾條件邏輯
    return tuningModel.filter((model) => {
      // 如果未選擇 agent，返回所有 tuningModel
      if (!selectedAgent) return true;

      // 否則僅返回符合 f_agent_uid 的 tuningModel
      return model.f_agent_uid === selectedAgent;
    });
  }, [tuningModel, selectedAgent]);

  return filteredTuningModel;
};

