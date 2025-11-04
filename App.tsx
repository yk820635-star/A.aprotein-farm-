import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FlockManagement from './pages/FlockManagement';
import DailyReport from './pages/DailyReport';
import Health from './pages/Health';
import EggProduction from './pages/EggProduction';
import FinanceLedger from './pages/FinanceLedger';
import Inventory from './pages/Inventory';
import SecurityGateLog from './pages/SecurityGateLog';
import Reports from './pages/Reports';
import DailyEntryForm from './pages/DailyEntryForm';
import { Page } from './types';
import NotificationContainer from './components/NotificationContainer';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Flock Management':
                return <FlockManagement />;
            case 'Daily Feed & Water':
                return <DailyReport />;
            case 'Mortality & Health':
                return <Health />;
            case 'Egg Production':
                return <EggProduction />;
            case 'Finance Ledger':
                return <FinanceLedger />;
            case 'Inventory':
                return <Inventory />;
            case 'Security Gate Log':
                return <SecurityGateLog />;
            case 'Reports':
                return <Reports />;
            case 'Daily Entry Form':
                return <DailyEntryForm />;
            default:
                return <Dashboard />;
        }
    };

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
             {/* Overlay for mobile when sidebar is open */}
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <DataProvider>
                <NotificationProvider>
                    <AppContent />
                    <NotificationContainer />
                </NotificationProvider>
            </DataProvider>
        </AuthProvider>
    );
};

export default App;