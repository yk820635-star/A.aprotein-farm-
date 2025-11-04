import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../NotificationContext';
import { FinanceTransaction, TransactionType, Role } from '../types';
import { FiPlusCircle, FiSave } from 'react-icons/fi';
import { formatDate, formatNumber } from '../utils/helpers';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const FinanceLedger: React.FC = () => {
    const { financeTransactions, addFinanceTransaction } = useData();
    const { addNotification } = useNotification();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.Inward);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canAddTransaction = user && [Role.Admin, Role.Accountant].includes(user.role);

    const initialFormState = {
        date: new Date().toISOString().substring(0, 10),
        voucherNo: '',
        type: activeTab,
        sourceOrExpenseType: '',
        amount: 0,
        remarks: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'amount' ? Number(value) : value }));
    };

    const handleOpenModal = (type: TransactionType) => {
        setActiveTab(type);
        setFormData({...initialFormState, type: type});
        setIsModalOpen(true);
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFinanceTransaction(formData);
        addNotification('Transaction added successfully!', 'success');
        setIsModalOpen(false);
    };

    const openingBalance = 50000; // Example
    const totalInward = financeTransactions.filter(t => t.type === TransactionType.Inward).reduce((sum, t) => sum + t.amount, 0);
    const totalOutward = financeTransactions.filter(t => t.type === TransactionType.Outward).reduce((sum, t) => sum + t.amount, 0);
    const closingBalance = openingBalance + totalInward - totalOutward;

    const filteredTransactions = financeTransactions.filter(t => t.type === activeTab).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add New ${formData.type} Transaction`}>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Voucher No.</label>
                        <input type="text" name="voucherNo" value={formData.voucherNo} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{formData.type === TransactionType.Inward ? 'Source' : 'Expense Type'}</label>
                        <input type="text" name="sourceOrExpenseType" value={formData.sourceOrExpenseType} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (PKR)</label>
                        <input type="number" name="amount" value={formData.amount || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <FiSave className="mr-2" /> Save Transaction
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center animate-fade-in-up">
                    {[{label: 'Opening Balance', value: openingBalance}, {label: 'Total Inward', value: totalInward}, {label: 'Total Outward', value: totalOutward}, {label: 'Closing Balance', value: closingBalance}].map(item => (
                        <div key={item.label} className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="text-xl font-bold text-gray-800">PKR {formatNumber(item.value)}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Finance Ledger</h2>
                        {canAddTransaction && (
                            <button onClick={() => handleOpenModal(activeTab)} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                <FiPlusCircle className="mr-2" /> Add New Transaction
                            </button>
                        )}
                    </div>
                    
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setActiveTab(TransactionType.Inward)} className={`${activeTab === TransactionType.Inward ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                Inward (Cash Received)
                            </button>
                            <button onClick={() => setActiveTab(TransactionType.Outward)} className={`${activeTab === TransactionType.Outward ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Outward (Cash Paid)
                            </button>
                        </nav>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    {['Date', 'Voucher No.', activeTab === TransactionType.Inward ? 'Source' : 'Expense Type', 'Amount (PKR)', 'Remarks'].map(h => <th key={h} className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTransactions.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4">{formatDate(t.date)}</td>
                                        <td className="py-4 px-4">{t.voucherNo}</td>
                                        <td className="py-4 px-4">{t.sourceOrExpenseType}</td>
                                        <td className={`py-4 px-4 font-semibold ${activeTab === TransactionType.Inward ? 'text-green-600' : 'text-red-600'}`}>{formatNumber(t.amount)}</td>
                                        <td className="py-4 px-4">{t.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FinanceLedger;