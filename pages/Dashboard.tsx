import React from 'react';
import DashboardCard from '../components/DashboardCard';
import DataChart from '../components/DataChart';
import { useData } from '../context/DataContext';
import { FiUsers, FiBox, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { formatNumber, isToday } from '../utils/helpers';
import { EggProductionReport, EggStock } from '../types';

const Dashboard: React.FC = () => {
    const { flocks, eggReports, feedReports, mortalityReports, inventory } = useData();

    const calculateTotalEggsFromStock = (stock: EggStock): number => (stock.petti * 360) + (stock.tray * 30) + stock.eggs;

    const getTotalEggsFromReport = (report: EggProductionReport): number => {
        return calculateTotalEggsFromStock(report.starter.today) +
            calculateTotalEggsFromStock(report.medium.today) +
            calculateTotalEggsFromStock(report.standard.today) +
            calculateTotalEggsFromStock(report.jumbo.today) +
            calculateTotalEggsFromStock(report.dirty.today) +
            calculateTotalEggsFromStock(report.broken.today) +
            calculateTotalEggsFromStock(report.liquid.today);
    };

    const totalBirds = flocks.reduce((sum, flock) => sum + flock.currentBirdCount, 0);
    
    const totalEggsToday = eggReports
        .filter(r => isToday(r.date))
        .reduce((sum, r) => sum + getTotalEggsFromReport(r), 0);

    const feedUsedToday = feedReports
        .filter(r => isToday(r.date))
        .reduce((sum, r) => {
            const flock = flocks.find(f => f.id === r.flockId);
            const feedInKg = flock ? (r.feedConsumedPerBird * flock.currentBirdCount) / 1000 : 0;
            return sum + feedInKg;
        }, 0);
        
    const mortality24h = mortalityReports
        .filter(r => isToday(r.date))
        .reduce((sum, r) => sum + r.total, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    const productionData = last7Days.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const dailyReports = eggReports.filter(r => r.date === dateString);
        const dailyData: { name: string, [key: string]: number | string } = {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        };
        flocks.forEach(flock => {
            const flockReport = dailyReports.find(r => r.flockId === flock.id);
            dailyData[flock.name] = flockReport ? getTotalEggsFromReport(flockReport) : 0;
        });
        return dailyData;
    });

    const feedData = last7Days.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const dailyFeedUsed = feedReports
            .filter(r => r.date === dateString)
            .reduce((sum, r) => {
                const flock = flocks.find(f => f.id === r.flockId);
                const feedInKg = flock ? (r.feedConsumedPerBird * flock.currentBirdCount) / 1000 : 0;
                return sum + feedInKg;
            }, 0);
        return {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            'Feed (kg)': Math.round(dailyFeedUsed),
        };
    });

    const lowStockItems = inventory.filter(item => item.stock <= item.lowStockThreshold);
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Today's Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Total Birds" value={formatNumber(totalBirds)} icon={FiUsers} color="#3498db" />
                <DashboardCard title="Eggs Collected" value={formatNumber(totalEggsToday)} icon={FiBox} color="#2ecc71" trend="up" trendText="+2% from yesterday" />
                <DashboardCard title="Feed Used (kg)" value={formatNumber(Math.round(feedUsedToday))} icon={FiTrendingUp} color="#f1c40f" />
                <DashboardCard title="Mortality (24h)" value={formatNumber(mortality24h)} icon={FiAlertTriangle} color="#e74c3c" trend="down" trendText="-1 from yesterday"/>
            </div>

            {lowStockItems.length > 0 && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm" role="alert">
                    <p className="font-bold">Alerts</p>
                    <ul className="list-disc list-inside mt-2 text-sm">
                        {lowStockItems.map(item => (
                             <li key={item.id}>Low Stock: {item.name} is below threshold ({formatNumber(item.stock)} / {formatNumber(item.lowStockThreshold)} {item.unit}).</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataChart 
                    title="Egg Production Trend (Last 7 Days)"
                    type="line"
                    data={productionData}
                    xAxisKey="name"
                    dataKeys={flocks.map((f, i) => ({ key: f.name, color: ['#3498db', '#2ecc71', '#e74c3c'][i % 3] }))}
                />
                <DataChart 
                    title="Feed Usage Trend (Last 7 Days)"
                    type="bar"
                    data={feedData}
                    xAxisKey="name"
                    dataKeys={[
                        { key: 'Feed (kg)', color: '#f1c40f' },
                    ]}
                />
            </div>
        </div>
    );
};

export default Dashboard;