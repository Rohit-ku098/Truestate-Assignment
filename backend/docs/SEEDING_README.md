# Transaction Seeding - Quick Start Guide

## Overview

This solution splits the large CSV file (100,000+ records) into smaller chunks and processes them sequentially to avoid memory issues.

## Steps

### 1. Split the CSV File

```bash
npm run split
```

This will:
- Read `src/data/truestate_assignment_dataset.csv`
- Split into chunks of 10,000 records each
- Save chunks in `src/data/chunks/` directory
- Create files: `chunk_001.csv`, `chunk_002.csv`, etc.

### 2. Seed the Database

```bash
npm run seed
```

This will:
- Process each chunk file sequentially
- Insert records into MongoDB
- Show progress for each file
- Display final statistics

## Configuration

### Adjust Chunk Size

Edit `src/scripts/splitCSV.js`:
```javascript
const RECORDS_PER_FILE = 10000; // Change this value
```

### Clear Existing Data

Edit `src/scripts/seedTransactions.js`:
```javascript
const CLEAR_EXISTING_DATA = true; // Set to false to append
```

## Example Output

### Splitting:
```
📂 CSV File Splitter
============================================================
Source: .../truestate_assignment_dataset.csv
Output: .../chunks
Records per file: 10000
============================================================

✓ Created chunk_001.csv (10000 records)
✓ Created chunk_002.csv (10000 records)
...
✓ Created chunk_010.csv (1000 records)

============================================================
✅ SPLITTING COMPLETED
============================================================
Total Records: 100000
Files Created: 10
Duration: 15.23 seconds
============================================================
```

### Seeding:
```
🌱 Multi-File Transaction Seeding
============================================================
✅ Connected to MongoDB
🗑️  Cleared 0 existing records
📦 Found 10 chunk files
============================================================

📄 Processing file 1/10: chunk_001.csv
   ✓ Inserted 10000 records
...
📄 Processing file 10/10: chunk_010.csv
   ✓ Inserted 1000 records

============================================================
📊 SEEDING COMPLETED
============================================================
Files Processed: 10
Total Records: 100000
✅ Successfully Inserted: 100000
❌ Failed: 0
⏱️  Duration: 45.67 seconds
⚡ Average Speed: 2189 records/sec
============================================================
```

## Files Created

- `src/scripts/splitCSV.js` - Splits large CSV into chunks
- `src/scripts/seedTransactions.js` - Seeds database from chunks
- `src/models/Transaction.js` - Mongoose model
- `src/data/chunks/` - Directory containing chunk files

## Troubleshooting

**Error: Chunks directory not found**
- Run `npm run split` first

**Memory issues**
- Reduce `RECORDS_PER_FILE` in `splitCSV.js`

**Duplicate key errors**
- Set `CLEAR_EXISTING_DATA = true` in `seedTransactions.js`
