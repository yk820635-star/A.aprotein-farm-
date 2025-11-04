
import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    trendText?: string;
    color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, trend, trendText, color }) => {
    const trendIcon = trend === 'up' ? <FiArrowUp /> : trend === 'down' ? <FiArrowDown /> : null;
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4" style={{ borderColor: color }}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20`}}>
                    <Icon size={24} style={{ color: color }} />
                </div>
            </div>
            {trend && trendText && (
                <div className={`flex items-center text-sm mt-4 ${trendColor}`}>
                    {trendIcon}
                    <span className="ml-1">{trendText}</span>
                </div>
            )}
        </div>
    );
};

export default DashboardCard;
