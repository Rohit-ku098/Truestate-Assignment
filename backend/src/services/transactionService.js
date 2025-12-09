const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");

/**
 * Build MongoDB query from request parameters
 */
function buildQuery(params) {
    const query = {};
    console.log("Query params: ", params);
    // Helper function to handle single or multiple values
    const buildFilterCondition = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? { $in: value } : null;
        }
        return value;
    };

    // Filter by order status
    if (params['status[]']) {
        console.log("Status: ", params['status[]']);
        const condition = buildFilterCondition(params['status[]']);
        if (condition) query.orderStatus = condition;
    }

    // Filter by product category
    if (params['category[]']) {
        const condition = buildFilterCondition(params['category[]']);
        if (condition) query.productCategory = condition;
    }

    // Filter by customer region
    if (params['region[]']) {
        const condition = buildFilterCondition(params['region[]']);
        if (condition) query.customerRegion = condition;
    }

    // Filter by customer type
    if (params['customerType[]']) {
        const condition = buildFilterCondition(params['customerType[]']);
        if (condition) query.customerType = condition;
    }

    // Filter by payment method
    if (params['paymentMethod[]']) {
        const condition = buildFilterCondition(params['paymentMethod[]']);
        if (condition) query.paymentMethod = condition;
    }

    // Filter by delivery type
    if (params['deliveryType[]']) {
        const condition = buildFilterCondition(params['deliveryType[]']);
        if (condition) query.deliveryType = condition;
    }

    // Filter by gender
    if (params['gender[]']) {
        const condition = buildFilterCondition(params['gender[]']);
        if (condition) query.gender = condition;
    }

    // Date range filter
    if (params['startDate'] || params['endDate']) {
        query.date = {};
        if (params['startDate']) {
            query.date.$gte = new Date(params['startDate']);
        }
        if (params['endDate']) {
            query.date.$lte = new Date(params['endDate']);
        }
    }

    // Amount range filter
    if (params['minAmount'] || params['maxAmount']) {
        query.finalAmount = {};
        if (params['minAmount']) {
            query.finalAmount.$gte = parseFloat(params['minAmount']);
        }
        if (params['maxAmount']) {
            query.finalAmount.$lte = parseFloat(params['maxAmount']);
        }
    }

    // Age range filter
    if (params['minAge'] || params['maxAge']) {
        query.age = {};
        if (params['minAge']) {
            query.age.$gte = parseInt(params['minAge']);
        }
        if (params['maxAge']) {
            query.age.$lte = parseInt(params['maxAge']);
        }
    }

    // Customer ID filter
    if (params['customerId']) {
        query.customerId = params['customerId'];
    }

    // Product ID filter
    if (params['productId']) {
        query.productId = params['productId'];
    }

    // Store ID filter
    if (params['storeId']) {
        query.storeId = params['storeId'];
    }

    return query;
}

/**
 * Build sort object from parameters
 */
function buildSort(sortBy = "date", sortOrder = "desc") {
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    return sort;
}

/**
 * Get all transactions with filtering, sorting, pagination, and search
 */
async function getAllTransactions(params) {
    const {
        page = 1,
        limit = 10,
        sortBy = "date",
        sortOrder = "desc",
        search,
        ...filterParams
    } = params;

    let query = buildQuery(filterParams);

    console.log("Filter Queries: ", query);
    // Add search functionality if search parameter is provided
    if (search) {
        const searchRegex = new RegExp(search, "i");

        const searchQuery = {
            $or: [
                { transactionId: searchRegex },
                { productId: searchRegex },
                { customerName: searchRegex },
                { productName: searchRegex },
                { phoneNumber: searchRegex },
                { brand: searchRegex },
                { productCategory: searchRegex },
                { storeLocation: searchRegex },
                { employeeName: searchRegex },
            ],
        };

        // Combine filter query with search query
        if (Object.keys(query).length > 0) {
            query = { $and: [query, searchQuery] };
        } else {
            query = searchQuery;
        }
    }

    const sort = buildSort(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
        Transaction.find(query)

            .allowDiskUse(true)
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip)
            .lean(),
        Transaction.countDocuments(query),
    ]);

    return {
        transactions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
}

/**
 * Get transaction by ID
 */
async function getTransactionById(id) {
    const transaction = await Transaction.findOne({ transactionId: id }).lean();

    if (!transaction) {
        throw new ApiError(404, "Transaction not found");
    }

    return transaction;
}


/**
 * Get transactions by customer ID
 */
async function getCustomerTransactions(customerId, params = {}) {
    const {
        page = 1,
        limit = 10,
        sortBy = "date",
        sortOrder = "desc",
    } = params;

    const query = { customerId };
    const sort = buildSort(sortBy, sortOrder);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
        Transaction.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip)
            .lean(),
        Transaction.countDocuments(query),
    ]);

    return {
        transactions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
}

module.exports = {
    getAllTransactions,
    getTransactionById,
    getCustomerTransactions,
};
