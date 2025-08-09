import { useState, useMemo } from "react";

export function useTableState(initialPageSize = 10) {
  const [pageSize] = useState(initialPageSize); // fixed value
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [tempKeyword, setTempKeyword] = useState("");
  const [total, setTotal] = useState(0);

  // Automatically compute total pages
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  return {
    // State
    pageSize,
    page,
    setPage,
    keyword,
    setKeyword,
    tempKeyword,
    setTempKeyword,
    total,
    setTotal,
    totalPages,
  };
}
