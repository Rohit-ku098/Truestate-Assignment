# TruEstate Transaction Dashboard

## Overview
TruEstate is a robust, full-stack transaction management dashboard designed to handle large datasets with ease. It provides a comprehensive view of business transactions, featuring interactive data visualization, advanced filtering, and real-time responsiveness. The application mimics a premium, production-ready environment suitable for tracking sales, customer demographics, and inventory performance.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Redux Toolkit, Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.js, MongoDB, Mongoose.
- **Tools**: Axios for HTTP requests

## Search Implementation Summary
The search functionality is powered by a robust backend query system:
- **Scope**: Searches across multiple fields simultaneously, including `transactionId`, `customerName`, `productName`, `phoneNumber`, `brand`, `productCategory`, `storeLocation`, and `employeeName`.
- **Method**: Utilizes MongoDB regular expressions (`$regex`) with the case-insensitive flag (`i`) within an `$or` array operator.
- **Integration**: The search query is combined with active filters using an `$and` operator to ensure users search only within their filtered dataset.

## Filter Implementation Summary
Advanced filtering capabilities supporting multi-select interactions:
- **UI**: Custom `MultiSelectDropdown` components allow users to select multiple criteria for Region, Gender, Category, Payment Method, and Status.
- **Backend Logic**:
  - Request parameters are parsed to handle both single string values and arrays (handled as comma-separated strings from GET requests).
  - Uses the MongoDB `$in` operator for array values to match documents against any of the selected criteria.
  - Supports range filtering for Dates, Amounts, and Age using `$gte` (greater than or equal) and `$lte` (less than or equal) operators.

## Sorting Implementation Summary
Dynamic server-side sorting ensures data is ordered efficiently at the source:
- **Parameters**: Accepts `sortBy` (field name) and `sortOrder` (`asc` or `desc`) query parameters.
- **Defaults**: Defaults to sorting by `date` in `descending` order to show the newest transactions first.
- **Handling**: The backend constructs a Mongoose sort object (e.g., `{ date: -1 }`) before executing the query.

## Pagination Implementation Summary
Scalable server-side pagination to manage performance with large datasets:
- **Logic**: Calculates `skip` and `limit` values based on the requested `page` number and `limit` per page (default: 10).
- **Response**: Returns the paginated data along with metadata:
  - `total`: Total count of matching documents.
  - `pages`: Total number of available pages.
  - `page`: Current page number.
- **Frontend**: The UI uses this metadata to render pagination controls, allowing users to navigate through the dataset without loading everything into memory.

## Database Seeding
To populate the database with initial data:
1. **Prepare Data**: Place your source CSV file into the `backend/data` directory.
2. **Split Data**: Run the split script to process large CSV files into manageable chunks:
   ```bash
   npm run split
   ```
3. **Seed Database**: Run the seed script to import the data into MongoDB:
   ```bash
   npm run seed
   ```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   - Create a `.env` file.
   - Add your connection string: `MONGO_URI=your_mongodb_connection_string`.
   - Set the port: `PORT=5000`.
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:5173`.
