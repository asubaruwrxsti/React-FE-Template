import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { UsePaginationReturn } from "@/hooks/use-pagination";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/hooks/use-scroll-to-top";

interface PaginationControlsProps {
    pagination: UsePaginationReturn;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    showPageSize?: boolean;
    showFirstLast?: boolean;
    showItemCounts?: boolean;
    slim?: boolean;
}

export function PaginationControls({
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    className,
    showPageSize = true,
    showFirstLast = true,
    showItemCounts = true,
    slim = false,
}: PaginationControlsProps) {
    const [key, setKey] = useState(0);

    useEffect(() => {
        setKey(prev => prev + 1);
    }, [pagination.currentPage, pagination.pageSize, pagination.totalPages]);

    const {
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        pageNumbers,
        isFirstPage,
        isLastPage,
        canGoBack,
        canGoNext,
        startItem,
        endItem,
    } = pagination;

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        } else {
            pagination.goToPage(page);
        }
        // Scroll to top when changing pages
        scrollToTop();
    };

    const handlePageSizeChange = (value: string) => {
        const newSize = parseInt(value, 10);
        if (onPageSizeChange) {
            onPageSizeChange(newSize);
        } else {
            pagination.setPageSize(newSize);
        }
        // Scroll to top when changing page size
        scrollToTop();
    };

    const handleNext = () => {
        if (onPageChange) {
            onPageChange(currentPage + 1);
        } else {
            pagination.nextPage();
        }
        // Scroll to top when going to next page
        scrollToTop();
    };

    const handlePrev = () => {
        if (onPageChange) {
            onPageChange(currentPage - 1);
        } else {
            pagination.prevPage();
        }
        // Scroll to top when going to previous page
        scrollToTop();
    };

    const handleFirst = () => {
        if (onPageChange) {
            onPageChange(1);
        } else {
            pagination.goToPage(1);
        }
        // Scroll to top when going to first page
        scrollToTop();
    };

    const handleLast = () => {
        if (onPageChange) {
            onPageChange(totalPages);
        } else {
            pagination.goToPage(totalPages);
        }
        // Scroll to top when going to last page
        scrollToTop();
    };

    if (totalPages <= 1 && !showItemCounts) {
        return null;
    }

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between py-4 gap-4", className)}>
            {showPageSize && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">per page</span>
                </div>
            )}

            <div className="flex items-center space-x-2">
                {showFirstLast && (
                    <Button
                        variant="outline"
                        size={slim ? "sm" : "default"}
                        onClick={handleFirst}
                        disabled={isFirstPage}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                        {!slim && <span className="ml-1">First</span>}
                    </Button>
                )}

                <Button
                    variant="outline"
                    size={slim ? "sm" : "default"}
                    onClick={handlePrev}
                    disabled={!canGoBack}
                >
                    <ChevronLeft className="h-4 w-4" />
                    {!slim && <span className="ml-1">Previous</span>}
                </Button>

                {/* Key forces re-render when pagination state changes */}
                <div key={`pagination-buttons-${key}`} className="flex items-center space-x-2">
                    {!slim && pageNumbers.map((pageNum) => (
                        <Button
                            key={`page-${pageNum}`}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-9"
                        >
                            {pageNum}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size={slim ? "sm" : "default"}
                    onClick={handleNext}
                    disabled={!canGoNext}
                >
                    {!slim && <span className="mr-1">Next</span>}
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {showFirstLast && (
                    <Button
                        variant="outline"
                        size={slim ? "sm" : "default"}
                        onClick={handleLast}
                        disabled={isLastPage}
                    >
                        {!slim && <span className="mr-1">Last</span>}
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {showItemCounts && totalItems > 0 && (
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {startItem}-{endItem} of {totalItems}
                </div>
            )}
        </div>
    );
}