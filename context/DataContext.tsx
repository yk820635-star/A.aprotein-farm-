import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
    Flock, 
    DailyFeedReport, 
    MortalityReport, 
    EggProductionReport, 
    FinanceTransaction, 
    InventoryItem, 
    SecurityLog,
    MedicineReport,
    EggStock
} from '../types';
import { 
    MOCK_FLOCKS, 
    MOCK_FEED_REPORTS, 
    MOCK_MORTALITY_REPORTS, 
    MOCK_EGG_REPORTS, 
    MOCK_FINANCE_TRANSACTIONS, 
    MOCK_INVENTORY, 
    MOCK_SECURITY_LOGS,
    MOCK_MEDICINE_REPORTS
} from '../constants';

interface DataContextType {
    flocks: Flock[];
    feedReports: DailyFeedReport[];
    mortalityReports: MortalityReport[];
    medicineReports: MedicineReport[];
    eggReports: EggProductionReport[];
    financeTransactions: FinanceTransaction[];
    inventory: InventoryItem[];
    securityLogs: SecurityLog[];
    addFlock: (flock: Omit<Flock, 'id' | 'currentBirdCount' | 'totalMortality' | 'totalFeed' | 'totalEggs'>) => void;
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
    addFeedReport: (report: Omit<DailyFeedReport, 'id'>) => void;
    addMortalityReport: (report: Omit<MortalityReport, 'id' | 'total'>) => void;
    addMedicineReport: (report: Omit<MedicineReport, 'id'>) => void;
    addEggProductionReport: (report: Omit<EggProductionReport, 'id'>) => void;
    addFinanceTransaction: (transaction: Omit<FinanceTransaction, 'id'>) => void;
    addSecurityLog: (log: Omit<SecurityLog, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const calculateTotalEggs = (stock: EggStock) => (stock.petti * 360) + (stock.tray * 30) + stock.eggs;
const calculateTotalEggsFromReport = (report: Omit<EggProductionReport, 'id'>): number => {
    return calculateTotalEggs(report.starter.today) +
        calculateTotalEggs(report.medium.today) +
        calculateTotalEggs(report.standard.today) +
        calculateTotalEggs(report.jumbo.today) +
        calculateTotalEggs(report.dirty.today) +
        calculateTotalEggs(report.broken.today) +
        calculateTotalEggs(report.liquid.today);
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [flocks, setFlocks] = useState<Flock[]>(MOCK_FLOCKS);
    const [feedReports, setFeedReports] = useState<DailyFeedReport[]>(MOCK_FEED_REPORTS);
    const [mortalityReports, setMortalityReports] = useState<MortalityReport[]>(MOCK_MORTALITY_REPORTS);
    const [medicineReports, setMedicineReports] = useState<MedicineReport[]>(MOCK_MEDICINE_REPORTS);
    const [eggReports, setEggReports] = useState<EggProductionReport[]>(MOCK_EGG_REPORTS);
    const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(MOCK_FINANCE_TRANSACTIONS);
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(MOCK_SECURITY_LOGS);

    const addFlock = (flock: Omit<Flock, 'id' | 'currentBirdCount' | 'totalMortality' | 'totalFeed' | 'totalEggs'>) => {
        const newFlock: Flock = {
            ...flock,
            id: `h${flocks.length + 1}`, // simple id generation
            currentBirdCount: flock.initialBirdCount,
            totalMortality: 0,
            totalFeed: 0,
            totalEggs: 0,
        };
        setFlocks(prev => [...prev, newFlock]);
    };
    
    const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
        const newItem = { ...item, id: `inv${inventory.length + 1}` };
        setInventory(prev => [newItem, ...prev]);
    };

    const addFeedReport = (report: Omit<DailyFeedReport, 'id'>) => {
        const newReport = { ...report, id: new Date().toISOString() };
        setFeedReports(prev => [newReport, ...prev]);
         // Update flock data
        setFlocks(prevFlocks => prevFlocks.map(flock => {
            if (flock.id === report.flockId) {
                const feedInKg = (report.feedConsumedPerBird * flock.currentBirdCount) / 1000;
                return {
                    ...flock,
                    totalFeed: flock.totalFeed + feedInKg,
                };
            }
            return flock;
        }));
    };

    const addMortalityReport = (report: Omit<MortalityReport, 'id' | 'total'>) => {
        const totalMortality = report.nightMortality + report.hospitalMortality;
        const newReport = { 
            ...report, 
            id: new Date().toISOString(),
            total: totalMortality,
        };
        setMortalityReports(prev => [newReport, ...prev]);
         // Update flock data
        setFlocks(prevFlocks => prevFlocks.map(flock => {
            if (flock.id === report.flockId) {
                return {
                    ...flock,
                    currentBirdCount: flock.currentBirdCount - totalMortality,
                    totalMortality: flock.totalMortality + totalMortality,
                };
            }
            return flock;
        }));
    };
    
    const addMedicineReport = (report: Omit<MedicineReport, 'id'>) => {
        const newReport = { ...report, id: new Date().toISOString() };
        setMedicineReports(prev => [newReport, ...prev]);
    };

    const addEggProductionReport = (report: Omit<EggProductionReport, 'id'>) => {
        const newReport = { ...report, id: new Date().toISOString() };
        setEggReports(prev => [newReport, ...prev]);
        // Update flock data
        const totalEggs = calculateTotalEggsFromReport(report);
        setFlocks(prevFlocks => prevFlocks.map(flock => {
            if (flock.id === report.flockId) {
                return {
                    ...flock,
                    totalEggs: flock.totalEggs + totalEggs,
                };
            }
            return flock;
        }));
    };
    
    const addFinanceTransaction = (transaction: Omit<FinanceTransaction, 'id'>) => {
        const newTransaction = { ...transaction, id: new Date().toISOString() };
        setFinanceTransactions(prev => [newTransaction, ...prev]);
    };
    
    const addSecurityLog = (log: Omit<SecurityLog, 'id'>) => {
        const newLog = { ...log, id: new Date().toISOString() };
        setSecurityLogs(prev => [newLog, ...prev]);
    };


    return (
        <DataContext.Provider value={{ 
            flocks, 
            feedReports, 
            mortalityReports,
            medicineReports,
            eggReports, 
            financeTransactions, 
            inventory, 
            securityLogs,
            addFlock,
            addInventoryItem,
            addFeedReport,
            addMortalityReport,
            addMedicineReport,
            addEggProductionReport,
            addFinanceTransaction,
            addSecurityLog,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};