import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../NotificationContext';
import { Flock, Role } from '../types';
import { formatDate, formatNumber } from '../utils/helpers';
import { FiEdit, FiTrash, FiPlusCircle, FiSave } from 'react-icons/fi';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const FlockManagement: React.FC = () => {
    const { flocks, addFlock } = useData();
    const { addNotification } = useNotification();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canAddFlock = user && [Role.Admin, Role.Manager].includes(user.role);
    
    const initialFormState = {
        name: '',
        breed: '',
        arrivalDate: new Date().toISOString().substring(0, 10),
        initialBirdCount: 0,
        costPerChick: 0,
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'initialBirdCount' || name === 'costPerChick' ? Number(value) : value }));
    };

    const handleAddFlock = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.name || !formData.breed || !formData.initialBirdCount) {
            addNotification('Please fill all required fields.', 'error');
            return;
        }
        addFlock(formData);
        addNotification(`Flock ${formData.name} added successfully!`, 'success');
        setIsModalOpen(false);
        setFormData(initialFormState);
    };

    const handleEditFlock = (id: string) => addNotification(`Edit flock ${id} functionality not implemented.`, 'info');
    const handleDeleteFlock = (id: string) => {
        addNotification(`Delete flock ${id} functionality not implemented.`, 'info');
    };
    
    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Flock">
                <form onSubmit={handleAddFlock} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Flock Name/Shed No.</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Breed</label>
                        <input type="text" name="breed" value={formData.breed} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Arrival Date</label>
                        <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Initial Bird Count</label>
                        <input type="number" name="initialBirdCount" value={formData.initialBirdCount || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Cost per Chick (PKR)</label>
                        <input type="number" name="costPerChick" value={formData.costPerChick || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiSave className="mr-2" /> Save Flock
                        </button>
                    </div>
                </form>
            </Modal>
            <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Flock Management</h2>
                    {canAddFlock && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FiPlusCircle className="mr-2" /> Add New Flock
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Flock Name', 'Breed', 'Arrival Date', 'Initial Birds', 'Current Birds', 'Mortality', 'Cost/Chick', 'Actions'].map(header => (
                                    <th key={header} className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600 tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 divide-y divide-gray-200">
                            {flocks.map(flock => (
                                <tr key={flock.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 font-semibold">{flock.name}</td>
                                    <td className="py-4 px-4">{flock.breed}</td>
                                    <td className="py-4 px-4">{formatDate(flock.arrivalDate)}</td>
                                    <td className="py-4 px-4">{formatNumber(flock.initialBirdCount)}</td>
                                    <td className="py-4 px-4">{formatNumber(flock.currentBirdCount)}</td>
                                    <td className="py-4 px-4">{formatNumber(flock.totalMortality)}</td>
                                    <td className="py-4 px-4">PKR {formatNumber(flock.costPerChick)}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleEditFlock(flock.id)} className="text-blue-500 hover:text-blue-700"><FiEdit size={18} /></button>
                                            <button onClick={() => handleDeleteFlock(flock.id)} className="text-red-500 hover:text-red-700"><FiTrash size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FlockManagement;