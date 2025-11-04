
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { FiPlusCircle, FiFilter } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';

const Health: React.FC = () => {
    const { mortalityReports, flocks, addMortalityReport } = useData();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().substring(0, 10),
        flockId: flocks.length > 0 ? flocks[0].id : '',
        nightMortality: '',
        hospitalMortality: '',
        remarks: ''
    });

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
        addMortalityReport({
            date: formData.date,
            flockId: formData.flockId,
            nightMortality: Number(formData.nightMortality) || 0,
            hospitalMortality: Number(formData.hospitalMortality) || 0,
            remarks: formData.remarks,
        });
        // Reset form
        setFormData({
            date: new Date().toISOString().substring(0, 10),
            flockId: flocks.length > 0 ? flocks[0].id : '',
            nightMortality: '',
            hospitalMortality: '',
            remarks: ''
        });
    };

     const filteredReports = useMemo(() => {
        return mortalityReports.filter(report => {
            const reportDate = new Date(report.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            return reportDate >= start && reportDate <= end;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [mortalityReports, startDate, endDate]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Daily Mortality</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700">Night Mortality</label>
                        <input type="number" name="nightMortality" value={formData.nightMortality} onChange={handleInputChange} placeholder="e.g., 2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hospital Mortality</label>
                        <input type="number" name="hospitalMortality" value={formData.hospitalMortality} onChange={handleInputChange} placeholder="e.g., 1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Remarks / Health Notes</label>
                        <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="e.g., Medicine administered..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                     <div className="md:col-span-2 lg:col-span-3">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiPlusCircle className="mr-2" /> Add Record
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Mortality Log</h3>
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
                                {['Date', 'Flock', 'Night', 'Hospital', 'Total', 'Remarks'].map(h => <th key={h} className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(r => (
                                <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">{formatDate(r.date)}</td>
                                    <td className="py-3 px-4 font-semibold">{flocks.find(f => f.id === r.flockId)?.name}</td>
                                    <td className="py-3 px-4">{r.nightMortality}</td>
                                    <td className="py-3 px-4">{r.hospitalMortality}</td>
                                    <td className="py-3 px-4 font-bold">{r.total}</td>
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

export default Health;
