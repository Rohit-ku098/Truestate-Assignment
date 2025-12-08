const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Transaction = require("../models/Transaction");
const { DB_NAME } = require("../config/constants");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Configuration
const CHUNKS_DIR = path.join(__dirname, "../data/chunks");
const CLEAR_EXISTING_DATA = false;

// Statistics  
let globalStats = {
    totalFiles: 0,
    totalRecords: 0,
    successful: 0,
    failed: 0,
    startTime: null,
    endTime: null,
};

// Parse CSV row to Transaction document
function parseTransaction(row) {
    try {
        const tags = row.Tags
            ? row.Tags.replace(/"/g, "")
                .split(",")
                .map((tag) => tag.trim())
            : [];

        const dateParts = row.Date.split("-");
        const date = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
        );

        return {
            transactionId: row["Transaction ID"],
            date: date,
            customerId: row["Customer ID"],
            customerName: row["Customer Name"],
            phoneNumber: row["Phone Number"],
            gender: row.Gender,
            age: parseInt(row.Age),
            customerRegion: row["Customer Region"],
            customerType: row["Customer Type"],
            productId: row["Product ID"],
            productName: row["Product Name"],
            brand: row.Brand,
            productCategory: row["Product Category"],
            tags: tags,
            quantity: parseInt(row.Quantity),
            pricePerUnit: parseFloat(row["Price per Unit"]),
            discountPercentage: parseFloat(row["Discount Percentage"]),
            totalAmount: parseFloat(row["Total Amount"]),
            finalAmount: parseFloat(row["Final Amount"]),
            paymentMethod: row["Payment Method"],
            orderStatus: row["Order Status"],
            deliveryType: row["Delivery Type"],
            storeId: row["Store ID"],
            storeLocation: row["Store Location"],
            salespersonId: row["Salesperson ID"],
            employeeName: row["Employee Name"],
        };
    } catch (error) {
        console.error(`Error parsing row:`, error.message);
        return null;
    }
}

// Process a single CSV file
async function processFile(filePath, fileNumber, totalFiles) {
    const fileName = path.basename(filePath);
    console.log(`\n📄 Processing file ${fileNumber}/${totalFiles}: ${fileName}`);

    const transactions = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                const transaction = parseTransaction(row);
                if (transaction) {
                    transactions.push(transaction);
                }
            })
            .on("end", async () => {
                try {
                    // Insert all transactions from this file
                    if (transactions.length > 0) {
                        await Transaction.insertMany(transactions, { ordered: false });
                        globalStats.successful += transactions.length;
                        console.log(`   ✓ Inserted ${transactions.length} records`);
                    }
                    resolve();
                } catch (error) {
                    if (error.writeErrors) {
                        const successCount = transactions.length - error.writeErrors.length;
                        globalStats.successful += successCount;
                        globalStats.failed += error.writeErrors.length;
                        console.log(`⚠ Inserted ${successCount} records (${error.writeErrors.length} failed)`);
                    } else {
                        globalStats.failed += transactions.length;
                        console.error(`❌ Error inserting records:`, error.message);
                    }
                    resolve();
                }
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

// Get all chunk files sorted
function getChunkFiles() {
    if (!fs.existsSync(CHUNKS_DIR)) {
        throw new Error(`Chunks directory not found: ${CHUNKS_DIR}\nPlease run 'npm run split' first.`);
    }

    const files = fs.readdirSync(CHUNKS_DIR)
        .filter(file => file.startsWith("chunk_") && file.endsWith(".csv"))
        .sort()
        .map(file => path.join(CHUNKS_DIR, file));

    if (files.length === 0) {
        throw new Error(`No chunk files found in: ${CHUNKS_DIR}\nPlease run 'npm run split' first.`);
    }

    return files;
}

// Main seeding function
async function seedTransactions() {
    console.log("🌱 Transaction Seeding\n");
    console.log("=".repeat(60));

    globalStats.startTime = Date.now();

    try {
        // Connect to MongoDB
        const connectionString = process.env.MONGODB_URI + "/" + DB_NAME;
        await mongoose.connect(connectionString);
        console.log("✅ Connected to MongoDB");

        // Clear existing data if configured
        if (CLEAR_EXISTING_DATA) {
            const deleteResult = await Transaction.deleteMany({});
            console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing records`);
        }

        // Get chunk files
        const chunkFiles = getChunkFiles();
        globalStats.totalFiles = chunkFiles.length;

        console.log(`📦 Found ${chunkFiles.length} chunk files`);
        console.log("=".repeat(60));

        // Process each file sequentially
        for (let i = 0; i < chunkFiles.length; i++) {
            await processFile(chunkFiles[i], i + 1, chunkFiles.length);
            globalStats.totalRecords += globalStats.successful + globalStats.failed;
        }

        globalStats.endTime = Date.now();
        const duration = ((globalStats.endTime - globalStats.startTime) / 1000).toFixed(2);

        // Print final statistics
        console.log("\n" + "=".repeat(60));
        console.log("📊 SEEDING COMPLETED");
        console.log("=".repeat(60));
        console.log(`Files Processed: ${globalStats.totalFiles}`);
        console.log(`Total Records: ${globalStats.successful + globalStats.failed}`);
        console.log(`✅ Successfully Inserted: ${globalStats.successful}`);
        console.log(`❌ Failed: ${globalStats.failed}`);
        console.log(`⏱️  Duration: ${duration} seconds`);
        console.log(`⚡ Average Speed: ${((globalStats.successful + globalStats.failed) / duration).toFixed(0)} records/sec`);
        console.log("=".repeat(60) + "\n");

    } catch (error) {
        console.error("\n❌ Seeding failed:", error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
    }
}

// Run the seeding process
seedTransactions()
    .then(() => {
        console.log("\n✨ Seeding process completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Fatal error:", error);
        process.exit(1);
    });
