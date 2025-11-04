import React from 'react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { useData } from '../context/DataContext';
import { formatNumber, isToday } from '../utils/helpers';
import { EggProductionReport, EggStock, TransactionType } from '../types';

const Reports: React.FC = () => {
    const { flocks, eggReports, feedReports, mortalityReports, financeTransactions } = useData();

    // Calculations for today's summary
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
    const totalEggsToday = eggReports.filter(r => isToday(r.date)).reduce((sum, r) => sum + getTotalEggsFromReport(r), 0);
    const feedUsedToday = feedReports.filter(r => isToday(r.date)).reduce((sum, r) => {
        const flock = flocks.find(f => f.id === r.flockId);
        const feedInKg = flock ? (r.feedConsumedPerBird * flock.currentBirdCount) / 1000 : 0;
        return sum + feedInKg;
    }, 0);
    const mortality24h = mortalityReports.filter(r => isToday(r.date)).reduce((sum, r) => sum + r.total, 0);
    const cashInwardToday = financeTransactions.filter(t => isToday(t.date) && t.type === TransactionType.Inward).reduce((sum, t) => sum + t.amount, 0);
    const cashOutwardToday = financeTransactions.filter(t => isToday(t.date) && t.type === TransactionType.Outward).reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = cashInwardToday - cashOutwardToday;
    const todayFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const handleExport = (format: 'PDF' | 'Excel') => {
        alert(`${format} export functionality not implemented.`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Report Type</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option>Daily Summary</option>
                            <option>Weekly Production</option>
                            <option>Monthly Finance</option>
                            <option>Flock Performance</option>
                            <option>Security Gate Logs</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                <div className="flex space-x-4">
                     <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Generate Report
                    </button>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Report Preview: Daily Summary ({todayFormatted})</h3>
                    <div className="flex space-x-2">
                         <button onClick={() => handleExport('PDF')} className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">
                            <FiDownload className="mr-1"/> PDF
                        </button>
                        <button onClick={() => handleExport('Excel')} className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
                            <FiDownload className="mr-1"/> Excel
                        </button>
                        <button onClick={handlePrint} className="flex items-center bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600">
                            <FiPrinter className="mr-1"/> Print
                        </button>
                    </div>
                </div>
                <div className="border rounded-lg p-8 printable-area">
                    <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-green-800">A&A PROTEIN FARM</h1>
                        <p className="text-sm text-gray-500">Basti Botay Wala, Multan</p>
                        <p className="font-semibold mt-2">Daily Summary Report for {todayFormatted}</p>
                    </div>
                    <div className="space-y-4 text-sm">
                        <p><strong>Total Birds:</strong> {formatNumber(totalBirds)}</p>
                        <p><strong>Total Egg Production:</strong> {formatNumber(totalEggsToday)}</p>
                        <p><strong>Total Feed Consumed:</strong> {formatNumber(Math.round(feedUsedToday))} kg</p>
                        <p><strong>Total Mortality:</strong> {formatNumber(mortality24h)}</p>
                        <p><strong>Cash Inward:</strong> PKR {formatNumber(cashInwardToday)}</p>
                        <p><strong>Cash Outward:</strong> PKR {formatNumber(cashOutwardToday)}</p>
                        <p><strong>Net Cash Flow:</strong> <span className={netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>PKR {formatNumber(netCashFlow)}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;