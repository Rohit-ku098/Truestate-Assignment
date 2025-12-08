const transactionService = require("../services/transactionService");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Get all transactions with filters and search
 * GET /api/transactions
 */
const getTransactions = asyncHandler(async (req, res) => {
    const result = await transactionService.getAllTransactions(req.query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    transactions: result.transactions,
                    pagination: result.pagination,
                },
                "Transactions fetched successfully"
            )
        );
});

/**
 * Get transaction by ID
 * GET /api/transactions/:id
 */
const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await transactionService.getTransactionById(req.params.id);

    return res
        .status(200)
        .json(
            new ApiResponse(200, transaction, "Transaction fetched successfully")
        );
});

/**
 * Get customer transactions
 * GET /api/transactions/customer/:customerId
 */
const getCustomerTransactions = asyncHandler(async (req, res) => {
    const result = await transactionService.getCustomerTransactions(
        req.params.customerId,
        req.query
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    transactions: result.transactions,
                    pagination: result.pagination,
                },
                "Customer transactions fetched successfully"
            )
        );
});

module.exports = {
    getTransactions,
    getTransactionById,
    getCustomerTransactions,
};
