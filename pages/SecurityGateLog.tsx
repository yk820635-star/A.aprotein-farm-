import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../NotificationContext';
import { SecurityLog, GateMovementType } from '../types';
import { FiPlusCircle, FiUpload } from 'react-icons/fi';
import { formatDateTime } from '../utils/helpers';

const SecurityGateLog: React.FC = () => {
    const { securityLogs, addSecurityLog } = useData();
    const { addNotification } = useNotification();
    const [activeTab, setActiveTab] = useState<GateMovementType>(GateMovementType.Inward);

    const initialFormState = {
        vehicleNumber: '',
        driverName: '',
        materialType: '',
        quantity: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addSecurityLog({
            ...formData,
            timestamp: new Date().toISOString(),
            type: activeTab
        });
        addNotification(`${activeTab} entry recorded successfully!`, 'success');
        setFormData(initialFormState);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Gate Entry</h2>
                
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab(GateMovementType.Inward)} className={`${activeTab === GateMovementType.Inward ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Inward Entry
                        </button>
                        <button onClick={() => setActiveTab(GateMovementType.Outward)} className={`${activeTab === GateMovementType.Outward ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                           Outward Entry
                        </button>
                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                        <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} placeholder="e.g., MNC-1234" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{activeTab === GateMovementType.Inward ? 'Driver Name' : 'Destination / Buyer Name'}</label>
                        <input type="text" name="driverName" value={formData.driverName} onChange={handleInputChange} placeholder="e.g., Ali Khan" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Material Type</label>
                        <input type="text" name="materialType" value={formData.materialType} onChange={handleInputChange} placeholder={activeTab === GateMovementType.Inward ? 'e.g., Feed, Medicine' : 'e.g., Eggs, Waste'} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="e.g., 200 bags" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Upload Photo/Document</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                     <div className="md:col-span-2">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiPlusCircle className="mr-2" /> Record {activeTab} Entry
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">Gate Log</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Timestamp', 'Type', 'Vehicle No.', 'Driver/Buyer', 'Material', 'Quantity', 'Document'].map(h => <th key={h} className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {securityLogs.map(log => (
                                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">{formatDateTime(log.timestamp)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`font-semibold ${log.type === GateMovementType.Inward ? 'text-blue-600' : 'text-purple-600'}`}>{log.type}</span>
                                    </td>
                                    <td className="py-3 px-4">{log.vehicleNumber}</td>
                                    <td className="py-3 px-4">{log.driverName}</td>
                                    <td className="py-3 px-4">{log.materialType}</td>
                                    <td className="py-3 px-4">{log.quantity}</td>
                                    <td className="py-3 px-4">
                                        {log.photoOrDocUrl && <a href={log.photoOrDocUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">View</a>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityGateLog;