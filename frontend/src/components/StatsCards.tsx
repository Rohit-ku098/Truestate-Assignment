import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions } from '../store/transactionSlice';
import { Info } from 'lucide-react';

const StatsCards: React.FC = () => {
    const dispatch = useAppDispatch();
    const { pagination } = useAppSelector((state) => state.transactions);

    // Calculate stats from pagination data
    const totalRecords = pagination.total || 0;

    return (
        <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <Info className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{totalRecords}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Current Page</span>
                    <Info className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                        {pagination.page} of {pagination.pages}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Records per Page</span>
                    <Info className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">{pagination.limit}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
