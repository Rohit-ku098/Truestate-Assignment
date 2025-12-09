# System Architecture

## 1. Backend Architecture
The backend follows a layered **Model-View-Controller (MVC)** (technically Controller-Service-Model) architecture, built with **Node.js** and **Express**. It is designed for separation of concerns, scalability, and maintainability.

- **Routes Layer**: Handles incoming HTTP requests and routes them to the appropriate controller methods.
- **Controller Layer**: Manages request/response logic, parses parameters (e.g., handling array query params), and orchestrates calls to services.
- **Service Layer**: Contains the core business logic. It handles database interactions, complex data processing, filtering, and sorting logic.
- **Model Layer**: Defines Mongoose schemas for MongoDB, providing structure and validation for the data.
- **Utils/Middleware**: Shared utilities for API responses (`ApiResponse`), error handling (`ApiError`), and async wrappers (`asyncHandler`).

## 2. Frontend Architecture
The frontend is a **Single Page Application (SPA)** built with **React (Vite)**, **TypeScript**, and **Redux Toolkit** for state management.

- **Component-Based UI**: UI is broken down into reusable components (e.g., `TransactionTable`, `FilterBar`, `MultiSelectDropdown`, `StatsCards`).
- **State Management**: **Redux Toolkit** manages global state (transactions, filters, loading states), ensuring data consistency across components.
- **API Layer**: Centralized API configuration using **Axios** interceptors for standardized request/response handling.
- **Styling**: **Tailwind CSS** is used for utility-first, responsive design.

## 3. Data Flow
1. **User Action**: User interacts with the UI (e.g., selects filters, changes page).
2. **State Update**: Redux action is dispatched (e.g., `setFilters`).
3. **API Request**: `transactionSlice` triggers an async thunk, calling `transactionApi`.
4. **Network Call**: Axios sends an HTTP GET request to the backend with query parameters (e.g., `?region=North,South&page=1`).
5. **Backend Routing**: Express router directs request to `transactionController`.
6. **Controller Logic**: Controller parses parameters (converting comma-separated strings to arrays) and calls `transactionService`.
7. **Business Logic**: Service builds a dynamic MongoDB query using Mongoose, applying filters (`$in`, `$regex`), sorting, and pagination.
8. **Database Interaction**: Mongoose executes the query against MongoDB.
9. **Response**: Data is returned up the chain, formatted into a standard `ApiResponse`, and sent to the frontend.
10. **UI Update**: Frontend receives data, updates Redux state, and components re-render with the new information.

## 4. Folder Structure

### Backend Structure
```
backend/
├── data/                  # CSV data files
├── src/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers (transactionController.js)
│   ├── models/           # Mongoose schemas (Transaction.js)
│   ├── routes/           # API routes (transactionRoutes.js)
│   ├── scripts/          # Seeding scripts (seedTransactions.js, splitCSV.js)
│   ├── services/         # Business logic (transactionService.js)
│   └── utils/            # Utilities (ApiError.js, ApiResponse.js)
├── index.js              # Entry point
└── package.json
```

### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── api/              # API integration (transactionApi.ts)
│   ├── assets/           # Static assets (images, icons)
│   ├── components/       # UI Components
│   │   ├── sidebar/      # Navigation components
│   │   ├── FilterBar.tsx
│   │   ├── MultiSelectDropdown.tsx
│   │   ├── StatsCards.tsx
│   │   └── TransactionTable.tsx
│   ├── store/            # Redux State Management
│   │   ├── hooks.ts
│   │   ├── store.ts
│   │   └── transactionSlice.ts
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── index.html
└── package.json
```

## 5. Module Responsibilities

### Backend Modules
- **Transaction Module**:
  - **Controller**: Endpoint entry/exit, parameter parsing.
  - **Service**: Complex filtering logic (building `$in` queries), sorting, and data retrieval.
  - **Model**: Data validation and tracking of transaction fields.

### Frontend Modules
- **Store Module (Redux)**:
  - Holds `transactions` array, `pagination` metadata, and current `filters`.
  - Handles async states (`loading`, `error`).
- **Filter Module**:
  - `FilterBar`: Orchestrates filter inputs.
  - `MultiSelectDropdown`: UI for selecting multiple values.
- **Display Module**:
  - `TransactionTable`: Renders data grids.
  - `StatsCards`: Shows summary metrics.
