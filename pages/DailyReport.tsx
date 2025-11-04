import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { DailyFeedReport } from '../types';
import { FiPlusCircle, FiFilter } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';

const DailyReport: React.FC = () => {
    const { feedReports, flocks, addFeedReport } = useData();
    const { addNotification } = useNotification();

    const initialFormState = {
        date: new Date().toISOString().substring(0, 10),
        flockId: flocks.length > 0 ? flocks[0].id : '',
        feedConsumedPerBird: '',
        waterConsumedNormal: '',
        waterConsumedMedicated: '',
        remarks: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const [startDate, setStartDate] = useState(oneWeekAgo.toISOString().substring(0, 10));
    const [endDate, setEndDate] = useState(today.toISOString().substring(0, 10));


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFeedReport({
            ...formData,
            feedConsumedPerBird: Number(formData.feedConsumedPerBird) || 0,
            waterConsumedNormal: Number(formData.waterConsumedNormal) || 0,
            waterConsumedMedicated: Number(formData.waterConsumedMedicated) || 0,
        });
        addNotification('Feed & Water report added successfully!', 'success');
        // Reset form
        setFormData(initialFormState);
    };
    
    const filteredReports = useMemo(() => {
        return feedReports.filter(report => {
            const reportDate = new Date(report.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            return reportDate >= start && reportDate <= end;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [feedReports, startDate, endDate]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add Daily Feed & Water Report</h2>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="hidden" name="id" />
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Feed Consumed (g/bird)</label>
                        <input type="number" name="feedConsumedPerBird" value={formData.feedConsumedPerBird} onChange={handleInputChange} placeholder="e.g., 110" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Water - Normal (L)</label>
                        <input type="number" name="waterConsumedNormal" value={formData.waterConsumedNormal} onChange={handleInputChange} placeholder="e.g., 800" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Water - Medicated (L)</label>
                        <input type="number" name="waterConsumedMedicated" value={formData.waterConsumedMedicated} onChange={handleInputChange} placeholder="e.g., 0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Any observations..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                     <div className="md:col-span-2 lg:col-span-3">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiPlusCircle className="mr-2" /> Add Report
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Historical Reports</h3>
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
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Date', 'Flock', 'Feed (g/bird)', 'Water Normal (L)', 'Water Medicated (L)', 'Remarks'].map(h => <th key={h} className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(r => (
                                <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">{formatDate(r.date)}</td>
                                    <td className="py-3 px-4 font-semibold">{flocks.find(f => f.id === r.flockId)?.name}</td>
                                    <td className="py-3 px-4">{r.feedConsumedPerBird}</td>
                                    <td className="py-3 px-4">{r.waterConsumedNormal}</td>
                                    <td className="py-3 px-4">{r.waterConsumedMedicated}</td>
                                    <td className="py-3 px-4">{r.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DailyReport;