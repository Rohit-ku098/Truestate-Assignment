import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions } from '../store/transactionSlice';
import type { Transaction } from '../api/transactionApi';

const generateTableData = (objectDataArray: Transaction[]): { headers: string[]; rows: any[][] } => {
    const fieldsToExclude = ['_id', 'createdAt', 'updatedAt', '__v'];
    const allHeaders = Object.keys(objectDataArray[0]);
    const headers = allHeaders.filter(header => !fieldsToExclude.includes(header));
    const rows = objectDataArray.map((item) => {
        return headers.map(header => (item as any)[header]);
    });
    return { headers, rows };
}

const TransactionTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { transactions, loading, error, filters } = useAppSelector((state) => state.transactions);

    useEffect(() => {
        dispatch(fetchTransactions(filters));
    }, [dispatch, filters]);


    const { headers, rows } = useMemo(() =>
        transactions.length > 0
            ? generateTableData(transactions)
            : { headers: [], rows: [] },
        [transactions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading transactions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
                        <tr className='bg-gray-100 '>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 whitespace-nowrap"
                                >
                                    {/* Separate snakecase to words */}
                                    {header.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {Array.isArray(cell) ? cell.join(', ') : cell?.toString() || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
