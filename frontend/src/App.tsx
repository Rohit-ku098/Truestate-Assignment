import { Provider } from 'react-redux';
import { store } from './store/store';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatsCards from './components/StatsCards';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Filter Bar */}
          <FilterBar />

          {/* Stats Cards */}
          <StatsCards />

          {/* Table Container */}
          <div className="flex-1 overflow-auto">
            <TransactionTable />
          </div>

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </Provider>
  );
}

export default App;
