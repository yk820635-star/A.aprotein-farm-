
import React from 'react';
import { Page, Role } from '../types';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../constants';
import { FiHome, FiFeather, FiDroplet, FiHeart, FiBox, FiDollarSign, FiArchive, FiShield, FiBarChart2, FiX, FiClipboard } from 'react-icons/fi';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const iconMap: Record<Page, React.ElementType> = {
    'Dashboard': FiHome,
    'Daily Entry Form': FiClipboard,
    'Flock Management': FiFeather,
    'Daily Feed & Water': FiDroplet,
    'Mortality & Health': FiHeart,
    'Egg Production': FiBox,
    'Finance Ledger': FiDollarSign,
    'Inventory': FiArchive,
    'Security Gate Log': FiShield,
    'Reports': FiBarChart2,
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isSidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth();
    
    if (!user) return null;

    const allowedPages = ROLE_PERMISSIONS[user.role];

    const NavLink: React.FC<{ page: Page }> = ({ page }) => {
        const Icon = iconMap[page];
        const isActive = currentPage === page;
        return (
            <li
                onClick={() => {
                    setCurrentPage(page);
                    setSidebarOpen(false);
                }}
                className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-gray-200 hover:bg-green-800 hover:text-white'
                }`}
            >
                <Icon className="mr-3" size={20} />
                <span className="font-medium">{page}</span>
            </li>
        );
    };

    return (
        <aside className={`w-64 bg-green-700 text-white p-4 flex flex-col flex-shrink-0
            fixed inset-y-0 left-0 z-30 
            md:static
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0`
        }>
            <div className="flex justify-between items-start mb-8 mt-4">
                 <div className="text-center">
                    <span className="text-5xl" role="img" aria-label="egg">🐔</span>
                    <h2 className="text-xl font-semibold mt-2">ERP System</h2>
                 </div>
                <button 
                    onClick={() => setSidebarOpen(false)} 
                    className="md:hidden text-white hover:text-green-200"
                    aria-label="Close menu"
                >
                    <FiX size={24} />
                </button>
            </div>
            <nav className="flex-1">
                <ul>
                    {allowedPages.map((page) => (
                        <NavLink key={page} page={page} />
                    ))}
                </ul>
            </nav>
            <div className="text-center text-xs text-green-200 mt-auto">
                <p>&copy; {new Date().getFullYear()} A&A Protein Farm</p>
            </div>
        </aside>
    );
};

export default Sidebar;
