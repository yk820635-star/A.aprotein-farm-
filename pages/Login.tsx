import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const LoginPage: React.FC = () => {
    const { login } = useAuth();

    const handleLogin = (role: Role) => {
        login(role);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl animate-fade-in-up">
                <div className="text-center">
                    <span className="text-6xl" role="img" aria-label="egg">🐔</span>
                    <h1 className="mt-4 text-3xl font-bold text-gray-800">A&A Protein Farm ERP</h1>
                    <p className="mt-2 text-sm text-gray-600">Please select your role to continue</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(Object.values(Role) as Role[]).map((role) => (
                        <button
                            key={role}
                            onClick={() => handleLogin(role)}
                            className="w-full px-4 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:-translate-y-1"
                        >
                            Login as {role}
                        </button>
                    ))}
                </div>
                 <div className="text-center text-xs text-gray-400 pt-4">
                    <p>This is a simulated login. No password required.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;