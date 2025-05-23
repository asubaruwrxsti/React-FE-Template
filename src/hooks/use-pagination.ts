import { useState, useCallback, useMemo } from 'react';

interface PaginationOptions {
    initialPage?: number;
    initialPageSize?: number;
    totalItems?: number;
    totalPages?: number;
}

interface PaginationState {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

interface PaginationActions {
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    setPageSize: (size: number) => void;
    resetPagination: () => void;
}

interface PaginationHelpers {
    canGoBack: boolean;
    canGoNext: boolean;
    pageNumbers: number[];
    startItem: number;
    endItem: number;
    isFirstPage: boolean;
    isLastPage: boolean;
}

export type UsePaginationReturn = PaginationState & PaginationActions & PaginationHelpers;

export function usePagination({
    initialPage = 1,
    initialPageSize = 10,
    totalItems = 0,
    totalPages = 0,
}: PaginationOptions = {}): UsePaginationReturn {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const calculatedTotalPages = totalItems > 0
        ? Math.ceil(totalItems / pageSize)
        : totalPages;

    const nextPage = useCallback(() => {
        if (currentPage < calculatedTotalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, calculatedTotalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= calculatedTotalPages) {
            setCurrentPage(page);
        }
    }, [calculatedTotalPages]);

    const resetPagination = useCallback(() => {
        setCurrentPage(initialPage);
        setPageSize(initialPageSize);
    }, [initialPage, initialPageSize]);

    const canGoBack = currentPage > 1;
    const canGoNext = currentPage < calculatedTotalPages;
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === calculatedTotalPages || calculatedTotalPages === 0;

    // Convert getPageNumbers from useCallback to useMemo so it recalculates when dependencies change
    const pageNumbers = useMemo(() => {
        if (calculatedTotalPages <= 1) return [1];

        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        const endPage = Math.min(startPage + maxButtons - 1, calculatedTotalPages);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }, [currentPage, calculatedTotalPages]);

    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

    return {
        currentPage,
        pageSize,
        totalPages: calculatedTotalPages,
        totalItems,
        nextPage,
        prevPage,
        goToPage,
        setPageSize,
        resetPagination,
        canGoBack,
        canGoNext,
        pageNumbers,
        startItem,
        endItem,
        isFirstPage,
        isLastPage
    };
}