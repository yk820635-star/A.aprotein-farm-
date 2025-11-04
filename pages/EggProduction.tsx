import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { FiPlusCircle, FiFilter } from 'react-icons/fi';
import { formatDate, formatNumber } from '../utils/helpers';
import DataChart from '../components/DataChart';
import { EggCategoryProduction, EggStock } from '../types';

const EggProduction: React.FC = () => {
    const { eggReports, flocks, addEggProductionReport } = useData();
     const [formData, setFormData] = useState({
        date: new Date().toISOString().substring(0, 10),
        flockId: flocks.length > 0 ? flocks[0].id : '',
        starter: '', medium: '', standard: '', jumbo: '', dirty: '', broken: '', liquid: ''
    });

    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const [startDate, setStartDate] = useState(oneWeekAgo.toISOString().substring(0, 10));
    const [endDate, setEndDate] = useState(today.toISOString().substring(0, 10));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const emptyEggStock: EggStock = { petti: 0, tray: 0, eggs: 0 };
    const createEggCategory = (totalEggs: number): EggCategoryProduction => ({
        opening: emptyEggStock,
        today: { petti: 0, tray: 0, eggs: totalEggs },
        sale: emptyEggStock,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEggProductionReport({
            date: formData.date,
            flockId: formData.flockId,
            starter: createEggCategory(Number(formData.starter) || 0),
            medium: createEggCategory(Number(formData.medium) || 0),
            standard: createEggCategory(Number(formData.standard) || 0),
            jumbo: createEggCategory(Number(formData.jumbo) || 0),
            dirty: createEggCategory(Number(formData.dirty) || 0),
            broken: createEggCategory(Number(formData.broken) || 0),
            liquid: createEggCategory(Number(formData.liquid) || 0),
        });
        // Reset form
        setFormData({
            date: new Date().toISOString().substring(0, 10),
            flockId: flocks.length > 0 ? flocks[0].id : '',
            starter: '', medium: '', standard: '', jumbo: '', dirty: '', broken: '', liquid: ''
        });
    };
    
    const productionData = [
        { name: 'Mon', H1: 4500, H2: 4700, H3: 4400 },
        { name: 'Tue', H1: 4550, H2: 4720, H3: 4420 },
        { name: 'Wed', H1: 4520, H2: 4710, H3: 4410 },
        { name: 'Thu', H1: 4580, H2: 4750, H3: 4450 },
        { name: 'Fri', H1: 4560, H2: 4737, H3: 4430 },
    ];

    const filteredReports = useMemo(() => {
        return eggReports.filter(report => {
            const reportDate = new Date(report.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            return reportDate >= start && reportDate <= end;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [eggReports, startDate, endDate]);
    
    const calculateTotalEggs = (stock: EggStock) => (stock.petti * 360) + (stock.tray * 30) + stock.eggs;
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Daily Egg Production</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Flock/Shed</label>
                        <select name="flockId" value={formData.flockId} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            {flocks.map(flock => <option key={flock.id} value={flock.id}>{flock.name}</option>)}
                        </select>
                    </div>
                    {['starter', 'medium', 'standard', 'jumbo', 'dirty', 'broken', 'liquid'].map(s => (
                         <div key={s}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">{s}</label>
                            <input type="number" name={s} value={formData[s as keyof typeof formData]} onChange={handleInputChange} placeholder="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                    ))}
                     <div className="col-span-2 md:col-span-4">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiPlusCircle className="mr-2" /> Add Production Record
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Production Log</h3>
                 <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b">
                    <FiFilter className="text-gray-500" />
                    <div>
                        <label className="text-sm font-medium text-gray-700 mr-2">From</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 mr-2">To</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Date', 'Flock', 'Starter', 'Medium', 'Standard', 'Jumbo', 'Dirty', 'Broken', 'Liquid', 'Total', 'Prod %'].map(h => <th key={h} className="text-left py-3 px-4 uppercase font-semibold text-gray-600">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(r => {
                                const flock = flocks.find(f => f.id === r.flockId);
                                const reportCategories = [r.starter, r.medium, r.standard, r.jumbo, r.dirty, r.broken, r.liquid];
                                const totalEggs = reportCategories.reduce((sum, cat) => sum + calculateTotalEggs(cat.today), 0);
                                const prodPercentage = flock ? ((totalEggs / flock.currentBirdCount) * 100).toFixed(2) : 'N/A';
                                return (
                                <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">{formatDate(r.date)}</td>
                                    <td className="py-3 px-4 font-semibold">{flock?.name}</td>
                                    {reportCategories.map((cat, i) => <td key={i} className="py-3 px-4">{formatNumber(calculateTotalEggs(cat.today))}</td>)}
                                    <td className="py-3 px-4 font-bold">{formatNumber(totalEggs)}</td>
                                    <td className="py-3 px-4 font-bold text-green-600">{prodPercentage}%</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
             <DataChart 
                    title="Production Comparison (H1 vs H2 vs H3)"
                    type="line"
                    data={productionData}
                    xAxisKey="name"
                    dataKeys={[
                        { key: 'H1', color: '#3498db' },
                        { key: 'H2', color: '#2ecc71' },
                        { key: 'H3', color: '#e74c3c' },
                    ]}
                />
        </div>
    );
};

export default EggProduction;