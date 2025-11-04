
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

interface HeaderProps {
    setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
            <div className="flex items-center">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-600 mr-3 md:hidden"
                    aria-label="Open menu"
                >
                    <FiMenu size={24} />
                </button>
                <span className="text-2xl mr-2" role="img" aria-label="egg">🥚</span>
                <div>
                    <h1 className="text-xl font-bold text-green-800">A&A PROTEIN FARM</h1>
                    <p className="text-xs text-gray-500">Basti Botay Wala, Multan</p>
                </div>
            </div>
            {user && (
                <div className="flex items-center">
                    <div className="text-right mr-4">
                        <p className="font-semibold text-sm text-gray-700 flex items-center"><FiUser className="mr-1"/> {user.username}</p>
                        <p className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">{user.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center text-sm text-gray-600 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <FiLogOut size={20} />
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
