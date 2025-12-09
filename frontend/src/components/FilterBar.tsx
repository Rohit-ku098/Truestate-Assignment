import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilters, clearFilters } from '../store/transactionSlice';
import FilterDropdown from './FilterDropdown';
import MultiSelectDropdown from './MultiSelectDropdown';

const FilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { filters } = useAppSelector((state) => state.transactions);

    // Filter options
    const regionOptions = [
        { value: 'North', label: 'North' },
        { value: 'South', label: 'South' },
        { value: 'East', label: 'East' },
        { value: 'West', label: 'West' },
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    const categoryOptions = [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Beauty', label: 'Beauty' },
        { value: 'Home', label: 'Home' },
        { value: 'Sports', label: 'Sports' },
    ];

    const paymentMethodOptions = [
        { value: 'Cash', label: 'Cash' },
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Debit Card', label: 'Debit Card' },
        { value: 'UPI', label: 'UPI' },
        { value: 'Net Banking', label: 'Net Banking' },
        { value: 'Wallet', label: 'Wallet' },
    ];

    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Returned', label: 'Returned' },
    ];

    const sortOptions = [
        { value: 'customerName-asc', label: 'Customer Name (A-Z)' },
        { value: 'customerName-desc', label: 'Customer Name (Z-A)' },
        { value: 'date-desc', label: 'Date (Newest)' },
        { value: 'date-asc', label: 'Date (Oldest)' },
        { value: 'finalAmount-desc', label: 'Amount (High to Low)' },
        { value: 'finalAmount-asc', label: 'Amount (Low to High)' },
        { value: 'quantity-asc', label: 'Quantity (Low to High)' },
        { value: 'quantity-desc', label: 'Quantity (High to Low)' },
    ];

    const handleMultiSelectChange = (key: string, values: string[]) => {
        dispatch(setFilters({ [key]: values.length > 0 ? values : undefined }));
    };

    const handleSortChange = (value: string) => {
        if (value) {
            const [sortBy, sortOrder] = value.split('-');
            dispatch(setFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
        }
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const currentSort = filters.sortBy && filters.sortOrder
        ? `${filters.sortBy}-${filters.sortOrder}`
        : 'date-desc';

    // Helper to convert filter values to arrays
    const getFilterArray = (value: string | string[] | undefined): string[] => {
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                    <button
                        onClick={handleClearFilters}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Clear all filters"
                    >
                        <RotateCcw className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>

                    <MultiSelectDropdown
                        label="Customer Region"
                        values={getFilterArray(filters.region)}
                        options={regionOptions}
                        onChange={(values) => handleMultiSelectChange('region', values)}
                    />

                    <MultiSelectDropdown
                        label="Gender"
                        values={getFilterArray(filters.gender)}
                        options={genderOptions}
                        onChange={(values) => handleMultiSelectChange('gender', values)}
                    />

                    <MultiSelectDropdown
                        label="Product Category"
                        values={getFilterArray(filters.category)}
                        options={categoryOptions}
                        onChange={(values) => handleMultiSelectChange('category', values)}
                    />

                    <MultiSelectDropdown
                        label="Payment Method"
                        values={getFilterArray(filters.paymentMethod)}
                        options={paymentMethodOptions}
                        onChange={(values) => handleMultiSelectChange('paymentMethod', values)}
                    />

                    <MultiSelectDropdown
                        label="Order Status"
                        values={getFilterArray(filters.status)}
                        options={statusOptions}
                        onChange={(values) => handleMultiSelectChange('status', values)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <FilterDropdown
                        label="Sort"
                        value={currentSort}
                        options={sortOptions}
                        onChange={handleSortChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
