import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { transactionApi, type Transaction, type TransactionQueryParams } from '../api/transactionApi';

interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    filters: TransactionQueryParams;
}

const initialState: TransactionState = {
    transactions: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
    filters: {
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
    },
};

// fetching transactions
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (params: TransactionQueryParams | undefined, { rejectWithValue }) => {
        try {
            const response = await transactionApi.getTransactions(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

// fetching transaction by ID
export const fetchTransactionById = createAsyncThunk(
    'transactions/fetchTransactionById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await transactionApi.getTransactionById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<TransactionQueryParams>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                page: 1,
                limit: 10,
                sortBy: 'date',
                sortOrder: 'desc',
            };
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.filters.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.data.transactions;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch transaction by ID
            .addCase(fetchTransactionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchTransactionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, setPage } = transactionSlice.actions;
export default transactionSlice.reducer;
