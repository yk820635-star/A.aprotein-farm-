import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { InventoryItem } from '../types';
import { FiPlusCircle, FiSave } from 'react-icons/fi';
import { formatNumber } from '../utils/helpers';
import Modal from '../components/Modal';

const Inventory: React.FC = () => {
    const { inventory, addInventoryItem } = useData();
    const { addNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialFormState = {
        name: '',
        category: 'Feed' as const,
        unit: 'kg' as const,
        stock: 0,
        lowStockThreshold: 0,
        supplier: '',
    };
    const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: (name === 'stock' || name === 'lowStockThreshold') ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addInventoryItem(formData);
        addNotification(`Item ${formData.name} added to inventory.`, 'success');
        setIsModalOpen(false);
        setFormData(initialFormState);
    };
    
    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Inventory Item">
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md" required>
                                <option>Feed</option>
                                <option>Medicine</option>
                                <option>Trays</option>
                                <option>Packaging</option>
                                <option>Diesel</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit</label>
                            <select name="unit" value={formData.unit} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md" required>
                                <option>kg</option>
                                <option>liters</option>
                                <option>units</option>
                                <option>bottles</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier</label>
                            <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Opening Stock</label>
                            <input type="number" name="stock" value={formData.stock || ''} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                            <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold || ''} onChange={handleInputChange} className="mt-1 block w-full border p-2 rounded-md" required/>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiSave className="mr-2" /> Save Item
                        </button>
                    </div>
                 </form>
            </Modal>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <FiPlusCircle className="mr-2" /> Add New Item
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                {['Item Name', 'Category', 'Current Stock', 'Unit', 'Low Stock Threshold', 'Supplier', 'Status'].map(header => (
                                    <th key={header} className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {inventory.map(item => {
                                const isLowStock = item.stock <= item.lowStockThreshold;
                                return (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-4 font-semibold">{item.name}</td>
                                        <td className="py-3 px-4">{item.category}</td>
                                        <td className="py-3 px-4">{formatNumber(item.stock)}</td>
                                        <td className="py-3 px-4">{item.unit}</td>
                                        <td className="py-3 px-4">{formatNumber(item.lowStockThreshold)}</td>
                                        <td className="py-3 px-4">{item.supplier}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                isLowStock 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                                {isLowStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Inventory;