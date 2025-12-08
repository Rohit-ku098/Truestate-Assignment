import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPage } from '../store/transactionSlice';

const Pagination: React.FC = () => {
    const dispatch = useAppDispatch();
    const { pagination } = useAppSelector((state) => state.transactions);
    const { page, pages } = pagination;

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers: number[] = [];
        const maxPagesToShow = 6;

        if (pages <= maxPagesToShow) {
            for (let i = 1; i <= pages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(pages);
            } else if (page >= pages - 2) {
                pageNumbers.push(1);
                for (let i = pages - 4; i <= pages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                for (let i = page - 1; i <= page + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(pages);
            }
        }

        return pageNumbers;
    };

    if (pages <= 1) return null;

    return (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-center space-x-2">
                {getPageNumbers().map((pageNum, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${pageNum === page
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Pagination;
