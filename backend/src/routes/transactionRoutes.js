const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");


/**
 * @route   GET /api/transactions/customer/:customerId
 * @desc    Get all transactions for a specific customer
 * @params  customerId
 * @query   page, limit, sortBy, sortOrder
 */
router.get("/customer/:customerId", transactionController.getCustomerTransactions);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by transaction ID
 * @params  id (transaction ID)
 */
router.get("/:id", transactionController.getTransactionById);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filters, sorting, pagination, and search
 * @query   page, limit, sortBy, sortOrder, search, status, category, region, etc.
 */
router.get("/", transactionController.getTransactions);

module.exports = router;
