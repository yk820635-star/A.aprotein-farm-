import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash, FiSave } from 'react-icons/fi';
// FIX: Import EggProductionReport type to resolve "Cannot find name" error.
import { EggCategoryProduction, EggStock, EggProductionReport } from '../types';
import { formatNumber } from '../utils/helpers';

const Accordion: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-xl font-bold text-gray-800"
            >
                <span>{title}</span>
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isOpen && <div className="mt-6 border-t pt-6">{children}</div>}
        </div>
    );
};

const eggSizes: (keyof Omit<EggProductionReport, 'id' | 'date' | 'flockId'>)[] = ['starter', 'medium', 'standard', 'jumbo', 'dirty', 'broken', 'liquid'];
const emptyEggStock: EggStock = { petti: 0, tray: 0, eggs: 0 };
const emptyEggCategory: EggCategoryProduction = { opening: emptyEggStock, today: emptyEggStock, sale: emptyEggStock };
const initialEggData = eggSizes.reduce((acc, size) => ({ ...acc, [size]: emptyEggCategory }), {} as Record<string, EggCategoryProduction>);


const DailyEntryForm: React.FC = () => {
    const { flocks, addFeedReport, addMortalityReport, addMedicineReport, addEggProductionReport } = useData();
    const { addNotification } = useNotification();
    const initialMedicineState = { medicineName: '', dose: '', medicineUsed: '', totalHours: '', remarks: '' };

    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [flockId, setFlockId] = useState(flocks.length > 0 ? flocks[0].id : '');
    
    // States for each section
    const [feedData, setFeedData] = useState({ feedConsumedPerBird: '', waterConsumedNormal: '', waterConsumedMedicated: '', openingStockFeed: '', feedReceived: '', totalFeedUsed: '', remarks: '' });
    const [mortalityData, setMortalityData] = useState({ nightMortality: '', hospitalMortality: '', remarks: '' });
    const [medicines, setMedicines] = useState([initialMedicineState]);
    const [eggData, setEggData] = useState(initialEggData);

    const selectedFlock = useMemo(() => flocks.find(f => f.id === flockId), [flockId, flocks]);

    useEffect(() => {
        if(selectedFlock) {
            setFeedData(prev => ({...prev, totalFeedUsed: (Number(prev.feedConsumedPerBird) * selectedFlock.currentBirdCount / 1000).toFixed(2)}))
        }
    }, [feedData.feedConsumedPerBird, selectedFlock]);

    const handleMedicineChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const list = [...medicines];
        list[index][name as keyof typeof initialMedicineState] = value;
        setMedicines(list);
    };
    
    const handleEggChange = (size: keyof typeof eggData, category: keyof EggCategoryProduction, unit: keyof EggStock, value: string) => {
        setEggData(prev => ({
            ...prev,
            [size]: {
                ...prev[size],
                [category]: {
                    ...prev[size][category],
                    [unit]: Number(value) || 0
                }
            }
        }));
    };

    const addMedicineRow = () => setMedicines([...medicines, initialMedicineState]);
    const removeMedicineRow = (index: number) => {
        if (medicines.length > 1) {
            const list = [...medicines];
            list.splice(index, 1);
            setMedicines(list);
        }
    };

    const resetForm = () => {
        setFeedData({ feedConsumedPerBird: '', waterConsumedNormal: '', waterConsumedMedicated: '', openingStockFeed: '', feedReceived: '', totalFeedUsed: '', remarks: '' });
        setMortalityData({ nightMortality: '', hospitalMortality: '', remarks: '' });
        setMedicines([initialMedicineState]);
        setEggData(initialEggData);
    }
    
    const calculateTotalEggs = (stock: EggStock) => (stock.petti * 360) + (stock.tray * 30) + stock.eggs;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!flockId) {
            addNotification('Please select a flock.', 'error');
            return;
        }

        // Submit Feed Report
        addFeedReport({
            date,
            flockId,
            feedConsumedPerBird: Number(feedData.feedConsumedPerBird) || 0,
            waterConsumedNormal: Number(feedData.waterConsumedNormal) || 0,
            waterConsumedMedicated: Number(feedData.waterConsumedMedicated) || 0,
            openingStockFeed: Number(feedData.openingStockFeed) || 0,
            feedReceived: Number(feedData.feedReceived) || 0,
            totalFeedUsed: Number(feedData.totalFeedUsed) || 0,
            remarks: feedData.remarks,
        });

        // Submit Mortality Report
        addMortalityReport({
            date,
            flockId,
            nightMortality: Number(mortalityData.nightMortality) || 0,
            hospitalMortality: Number(mortalityData.hospitalMortality) || 0,
            remarks: mortalityData.remarks,
        });

        // Submit Medicine Reports
        medicines.forEach(med => {
            if(med.medicineName) {
                addMedicineReport({ date, flockId, ...med });
            }
        });
        
        // Submit Egg Production Report
        addEggProductionReport({
            date,
            flockId,
            ...eggData
        });

        addNotification(`Daily report for Flock ${selectedFlock?.name} on ${date} submitted successfully!`, 'success');
        resetForm();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Consolidated Daily Entry</h2>
                 <p className="text-gray-600 mb-6">Enter all daily operational data for a single flock/unit here.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Flock/Unit</label>
                        <select value={flockId} onChange={e => setFlockId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
                            <option value="">-- Select Flock --</option>
                            {flocks.map(flock => <option key={flock.id} value={flock.id}>{flock.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <Accordion title="Water & Feeds Report">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Water - Normal (L)</label>
                        <input type="number" value={feedData.waterConsumedNormal} onChange={e => setFeedData({...feedData, waterConsumedNormal: e.target.value})} placeholder="e.g., 800" className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Water - Medicated (L)</label>
                        <input type="number" value={feedData.waterConsumedMedicated} onChange={e => setFeedData({...feedData, waterConsumedMedicated: e.target.value})} placeholder="e.g., 0" className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                    
                    <div className="border-t col-span-full my-4"></div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Opening Stock (kg)</label>
                        <input type="number" value={feedData.openingStockFeed} onChange={e => setFeedData({...feedData, openingStockFeed: e.target.value})} className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Feed Received (kg)</label>
                        <input type="number" value={feedData.feedReceived} onChange={e => setFeedData({...feedData, feedReceived: e.target.value})} className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">Feed Consumed (g/bird)</label>
                        <input type="number" value={feedData.feedConsumedPerBird} onChange={e => setFeedData({...feedData, feedConsumedPerBird: e.target.value})} className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Total Feed Used (kg)</label>
                        <input type="number" value={feedData.totalFeedUsed} disabled className="mt-1 w-full border p-2 rounded-md bg-gray-100" />
                    </div>
                    <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea value={feedData.remarks} onChange={e => setFeedData({...feedData, remarks: e.target.value})} placeholder="Remarks..." className="w-full border p-2 rounded-md mt-1"></textarea>
                    </div>
                </div>
            </Accordion>
            
            <Accordion title="Daily Mortality Report">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    {selectedFlock && (
                        <>
                            <div className="p-2 bg-gray-100 rounded-md text-center">
                                <p className="text-sm text-gray-600">Total Birds (Opening)</p>
                                <p className="font-bold text-lg">{formatNumber(selectedFlock.currentBirdCount)}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-md text-center">
                                <p className="text-sm text-gray-600">Mortality Cumulative</p>
                                <p className="font-bold text-lg">{formatNumber(selectedFlock.totalMortality)}</p>
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Night/Day Mortality</label>
                        <input type="number" value={mortalityData.nightMortality} onChange={e => setMortalityData({...mortalityData, nightMortality: e.target.value})} className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hospital Mortality</label>
                        <input type="number" value={mortalityData.hospitalMortality} onChange={e => setMortalityData({...mortalityData, hospitalMortality: e.target.value})} className="mt-1 w-full border p-2 rounded-md" />
                    </div>
                     <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea value={mortalityData.remarks} onChange={e => setMortalityData({...mortalityData, remarks: e.target.value})} placeholder="Remarks..." className="w-full border p-2 rounded-md mt-1"></textarea>
                    </div>
                </div>
            </Accordion>

            <Accordion title="Daily Medicine Report">
                {medicines.map((med, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-5 gap-2 mb-3 p-2 border rounded-md items-center">
                        <input type="text" name="medicineName" value={med.medicineName} onChange={e => handleMedicineChange(index, e)} placeholder="Medicine Name" className="border p-2 rounded-md" />
                        <input type="text" name="dose" value={med.dose} onChange={e => handleMedicineChange(index, e)} placeholder="Dose" className="border p-2 rounded-md" />
                        <input type="text" name="medicineUsed" value={med.medicineUsed} onChange={e => handleMedicineChange(index, e)} placeholder="Medicine Used" className="border p-2 rounded-md" />
                        <input type="text" name="totalHours" value={med.totalHours} onChange={e => handleMedicineChange(index, e)} placeholder="Total Hours" className="border p-2 rounded-md" />
                         <div className="flex items-center">
                            <textarea name="remarks" value={med.remarks} onChange={e => handleMedicineChange(index, e)} placeholder="Remarks" className="border p-2 rounded-md w-full h-10"></textarea>
                            {medicines.length > 1 && <button type="button" onClick={() => removeMedicineRow(index)} className="ml-2 text-red-500 hover:text-red-700 p-2"><FiTrash/></button>}
                         </div>
                    </div>
                ))}
                <button type="button" onClick={addMedicineRow} className="flex items-center text-sm text-green-600 hover:text-green-800"><FiPlus className="mr-1"/> Add Medicine</button>
            </Accordion>

            <Accordion title="Daily Eggs Production Report">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-center">
                        <thead className="bg-gray-100">
                             <tr>
                                <th rowSpan={2} className="py-2 px-2 border">Egg Weight</th>
                                <th colSpan={3} className="py-2 px-2 border">Opening Stock</th>
                                <th colSpan={3} className="py-2 px-2 border">Today Production</th>
                                <th colSpan={3} className="py-2 px-2 border">Sale</th>
                                <th colSpan={3} className="py-2 px-2 border">Closing Stock</th>
                             </tr>
                             <tr>
                                {['Petti','Tray','Eggs'].map(h => <th key={`os-${h}`} className="py-2 px-1 border font-medium">{h}</th>)}
                                {['Petti','Tray','Eggs'].map(h => <th key={`tp-${h}`} className="py-2 px-1 border font-medium">{h}</th>)}
                                {['Petti','Tray','Eggs'].map(h => <th key={`sa-${h}`} className="py-2 px-1 border font-medium">{h}</th>)}
                                {['Petti','Tray','Eggs'].map(h => <th key={`cs-${h}`} className="py-2 px-1 border font-medium">{h}</th>)}
                             </tr>
                        </thead>
                        <tbody>
                            {eggSizes.map(size => {
                                const d = eggData[size];
                                const closingTotal = calculateTotalEggs(d.opening) + calculateTotalEggs(d.today) - calculateTotalEggs(d.sale);
                                const closingPetti = Math.floor(closingTotal / 360);
                                const closingTray = Math.floor((closingTotal % 360) / 30);
                                const closingEggs = closingTotal % 30;
                                return (
                                <tr key={size}>
                                    <td className="py-1 px-2 border capitalize font-semibold">{size}</td>
                                    {(['opening', 'today', 'sale'] as const).map(cat => 
                                        (['petti', 'tray', 'eggs'] as const).map(unit =>
                                            // FIX: Explicitly convert `size` to a string in the key to avoid potential runtime errors.
                                            <td key={`${String(size)}-${cat}-${unit}`} className="border p-0"><input type="number" min="0" value={d[cat][unit] || ''} onChange={e => handleEggChange(size, cat, unit, e.target.value)} className="w-full h-full text-center p-1"/></td>
                                        )
                                    )}
                                    <td className="border p-1 bg-gray-100">{closingPetti}</td>
                                    <td className="border p-1 bg-gray-100">{closingTray}</td>
                                    <td className="border p-1 bg-gray-100">{closingEggs}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Accordion>

            <div>
                 <button type="submit" className="w-full md:w-auto flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold">
                    <FiSave className="mr-2" /> Submit Full Daily Report
                </button>
            </div>
        </form>
    );
};

export default DailyEntryForm;