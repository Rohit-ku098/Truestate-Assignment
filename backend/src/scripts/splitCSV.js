const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Configuration
const SOURCE_CSV = path.join(__dirname, "../data/truestate_assignment_dataset.csv");
const OUTPUT_DIR = path.join(__dirname, "../data/chunks");
const RECORDS_PER_FILE = 10000; // 10k records per file

// Statistics
let stats = {
    totalRecords: 0,
    filesCreated: 0,
};

// Create output directory if it doesn't exist
function ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`✅ Created output directory: ${OUTPUT_DIR}\n`);
    } else {
        // Clean existing chunk files
        const files = fs.readdirSync(OUTPUT_DIR);
        files.forEach(file => {
            if (file.startsWith("chunk_") && file.endsWith(".csv")) {
                fs.unlinkSync(path.join(OUTPUT_DIR, file));
            }
        });
        console.log(`🗑️  Cleaned existing chunk files\n`);
    }
}

// Convert object to CSV row
function objectToCSVRow(obj, headers) {
    return headers.map(header => {
        const value = obj[header] || "";
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value.toString().includes(",") || value.toString().includes('"')) {
            return `"${value.toString().replace(/"/g, '""')}"`;
        }
        return value;
    }).join(",");
}

// Write chunk to file
function writeChunkToFile(chunkNumber, headers, records) {
    const fileName = `chunk_${String(chunkNumber).padStart(3, "0")}.csv`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // Write header
    const csvContent = [
        headers.join(","),
        ...records.map(record => objectToCSVRow(record, headers))
    ].join("\n");

    fs.writeFileSync(filePath, csvContent, "utf8");
    stats.filesCreated++;

    console.log(`✓ Created ${fileName} (${records.length} records)`);
}

// Main splitting function
async function splitCSV() {
    console.log("📂 CSV File Splitter\n");
    console.log("=".repeat(60));
    console.log(`Source: ${SOURCE_CSV}`);
    console.log(`Output: ${OUTPUT_DIR}`);
    console.log(`Records per file: ${RECORDS_PER_FILE}`);
    console.log("=".repeat(60) + "\n");

    ensureOutputDir();

    const startTime = Date.now();
    let headers = [];
    let currentChunk = [];
    let chunkNumber = 1;

    return new Promise((resolve, reject) => {
        fs.createReadStream(SOURCE_CSV)
            .pipe(csv())
            .on("data", (row) => {
                // Extract headers from first row
                if (headers.length === 0) {
                    headers = Object.keys(row);
                }

                currentChunk.push(row);
                stats.totalRecords++;

                // Write chunk when it reaches the limit
                if (currentChunk.length >= RECORDS_PER_FILE) {
                    writeChunkToFile(chunkNumber, headers, currentChunk);
                    chunkNumber++;
                    currentChunk = [];
                }
            })
            .on("end", () => {
                // Write remaining records
                if (currentChunk.length > 0) {
                    writeChunkToFile(chunkNumber, headers, currentChunk);
                }

                const duration = ((Date.now() - startTime) / 1000).toFixed(2);

                console.log("\n" + "=".repeat(60));
                console.log("✅ SPLITTING COMPLETED");
                console.log("=".repeat(60));
                console.log(`Total Records: ${stats.totalRecords}`);
                console.log(`Files Created: ${stats.filesCreated}`);
                console.log(`Duration: ${duration} seconds`);
                console.log("=".repeat(60) + "\n");

                resolve();
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

// Run the splitter
splitCSV()
    .then(() => {
        console.log("✨ File splitting completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Error:", error.message);
        console.error(error.stack);
        process.exit(1);
    });
