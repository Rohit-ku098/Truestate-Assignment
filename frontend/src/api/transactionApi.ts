import apiClient from './apiClient';

export interface Transaction {
    _id: string;
    transactionId: string;
    date: string;
    customerId: string;
    customerName: string;
    phoneNumber: string;
    gender: string;
    age: number;
    customerRegion: string;
    customerType: string;
    productId: string;
    productName: string;
    brand: string;
    productCategory: string;
    tags: string[];
    quantity: number;
    pricePerUnit: number;
    discountPercentage: number;
    totalAmount: number;
    finalAmount: number;
    paymentMethod: string;
    orderStatus: string;
    deliveryType: string;
    storeId: string;
    storeLocation: string;
    salespersonId: string;
    employeeName: string;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: {
        transactions: Transaction[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface TransactionQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    status?: string | string[];
    category?: string | string[];
    region?: string | string[];
    gender?: string | string[];
    paymentMethod?: string | string[];
    deliveryType?: string | string[];
    customerType?: string | string[];
    minAmount?: number;
    maxAmount?: number;
    minAge?: number;
    maxAge?: number;
    startDate?: string;
    endDate?: string;
}

export const transactionApi = {
    getTransactions: async (params: TransactionQueryParams = {}): Promise<TransactionResponse> => {
        const response = await apiClient.get<TransactionResponse>('/transactions', { params });
        return response.data;
    },

    getTransactionById: async (id: string): Promise<Transaction> => {
        const response = await apiClient.get<{ success: boolean; data: Transaction }>(`/transactions/${id}`);
        return response.data.data;
    },

    getCustomerTransactions: async (customerId: string, params: TransactionQueryParams = {}): Promise<TransactionResponse> => {
        const response = await apiClient.get<TransactionResponse>(`/transactions/customer/${customerId}`, { params });
        return response.data;
    },
};
