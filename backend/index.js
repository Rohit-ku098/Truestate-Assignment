const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./src/config/connectDb");
const transactionRoutes = require("./src/routes/transactionRoutes");
const { asyncHandler } = require("./src/utils/asyncHandler");
const ApiResponse = require("./src/utils/ApiResponse");
const cors = require("cors");

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

// Routes
app.use("/api/transactions", transactionRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "TruEstate API is running" });
});

// Error handling middleware
app.use(async (err, req, res, next) => {
    return res
        .status(err.statusCode || 500)
        .json(
            new ApiResponse(
                err.statusCode || 500,
                {},
                err.message
            )
        )
})

const PORT = process.env.PORT || 3000;
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(() => {
        console.log("MongoDB connection error closing the server")
        process.exit(1)
    })
