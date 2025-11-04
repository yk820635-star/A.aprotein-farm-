// FIX: Import the 'Page' type to resolve a type error.
import { Flock, DailyFeedReport, MortalityReport, EggProductionReport, FinanceTransaction, InventoryItem, SecurityLog, Role, GateMovementType, TransactionType, Page, MedicineReport, EggStock } from './types';

export const MOCK_FLOCKS: Flock[] = [
    { id: 'h1', name: 'H1', breed: 'Lohmann Brown', arrivalDate: '2023-01-15', initialBirdCount: 5000, currentBirdCount: 4850, costPerChick: 120, totalMortality: 150, totalFeed: 55000, totalEggs: 950000 },
    { id: 'h2', name: 'H2', breed: 'Hy-Line Brown', arrivalDate: '2023-03-20', initialBirdCount: 5000, currentBirdCount: 4910, costPerChick: 125, totalMortality: 90, totalFeed: 52000, totalEggs: 925000 },
    { id: 'h3', name: 'H3', breed: 'ISA Brown', arrivalDate: '2023-06-10', initialBirdCount: 5000, currentBirdCount: 4950, costPerChick: 122, totalMortality: 50, totalFeed: 48000, totalEggs: 890000 },
];

export const MOCK_FEED_REPORTS: DailyFeedReport[] = [
    { id: 'fr1', date: '2024-07-27', flockId: 'h1', feedConsumedPerBird: 110, waterConsumedNormal: 800, waterConsumedMedicated: 0, openingStockFeed: 1500, feedReceived: 500, totalFeedUsed: 533.5, remarks: 'Normal consumption' },
    { id: 'fr2', date: '2024-07-27', flockId: 'h2', feedConsumedPerBird: 112, waterConsumedNormal: 810, waterConsumedMedicated: 0, openingStockFeed: 1800, feedReceived: 0, totalFeedUsed: 550, remarks: 'Slightly increased water intake' },
];

export const MOCK_MORTALITY_REPORTS: MortalityReport[] = [
    { id: 'mr1', date: '2024-07-27', flockId: 'h1', nightMortality: 2, hospitalMortality: 1, total: 3, remarks: 'Normal mortality rate' },
];

export const MOCK_MEDICINE_REPORTS: MedicineReport[] = [
    { id: 'medr1', date: '2024-07-27', flockId: 'h1', medicineName: 'Kanamycin', dose: '1ml/L', medicineUsed: '4 Bottles', totalHours: '2 hrs', remarks: 'For respiratory issues' },
];

const emptyEggStock: EggStock = { petti: 0, tray: 0, eggs: 0 };
const emptyEggCategory = { opening: emptyEggStock, today: emptyEggStock, sale: emptyEggStock };


export const MOCK_EGG_REPORTS: EggProductionReport[] = [
    { 
        id: 'er1', 
        date: '2024-07-27', 
        flockId: 'h1', 
        starter: { ...emptyEggCategory, today: { petti: 0, tray: 3, eggs: 10 } },
        medium: { ...emptyEggCategory, today: { petti: 2, tray: 20, eggs: 0 } },
        standard: { ...emptyEggCategory, today: { petti: 9, tray: 23, eggs: 4 } },
        jumbo: { ...emptyEggCategory, today: { petti: 1, tray: 3, eggs: 4 } },
        broken: { ...emptyEggCategory, today: { petti: 0, tray: 1, eggs: 20 } },
        dirty: { ...emptyEggCategory },
        liquid: { ...emptyEggCategory, today: { petti: 0, tray: 0, eggs: 10 } },
    },
];

export const MOCK_FINANCE_TRANSACTIONS: FinanceTransaction[] = [
    { id: 'ft1', date: '2024-07-27', voucherNo: 'IN-001', type: TransactionType.Inward, sourceOrExpenseType: 'Egg Sales - Local Market', amount: 55000, remarks: 'Payment from Tariq Traders' },
    { id: 'ft2', date: '2024-07-27', voucherNo: 'OUT-001', type: TransactionType.Outward, sourceOrExpenseType: 'Feed Purchase', amount: 120000, remarks: 'Paid to Punjab Feeds' },
    { id: 'ft3', date: '2024-07-27', voucherNo: 'OUT-002', type: TransactionType.Outward, sourceOrExpenseType: 'Diesel', amount: 5000, remarks: 'For generator' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv1', name: 'Layer Feed A', category: 'Feed', unit: 'kg', stock: 15000, lowStockThreshold: 5000, supplier: 'Punjab Feeds' },
    { id: 'inv2', name: 'Calcium Vita', category: 'Medicine', unit: 'bottles', stock: 50, lowStockThreshold: 10, supplier: 'Pharma Solutions' },
    { id: 'inv3', name: 'Egg Trays', category: 'Trays', unit: 'units', stock: 20000, lowStockThreshold: 5000, supplier: 'Packaging Co.' },
];

export const MOCK_SECURITY_LOGS: SecurityLog[] = [
    { id: 'sl1', timestamp: '2024-07-28 09:15:23', type: GateMovementType.Inward, vehicleNumber: 'MNC-1234', driverName: 'Ali Khan', materialType: 'Feed', quantity: '200 bags', photoOrDocUrl: 'https://picsum.photos/200' },
    { id: 'sl2', timestamp: '2024-07-28 11:45:05', type: GateMovementType.Outward, vehicleNumber: 'LET-5678', driverName: 'Bilal Ahmed', materialType: 'Eggs', quantity: '500 trays', photoOrDocUrl: 'https://picsum.photos/201' },
];

export const ROLE_PERMISSIONS: Record<Role, Page[]> = {
    [Role.Admin]: ['Dashboard', 'Daily Entry Form', 'Flock Management', 'Daily Feed & Water', 'Mortality & Health', 'Egg Production', 'Finance Ledger', 'Inventory', 'Security Gate Log', 'Reports'],
    [Role.Manager]: ['Dashboard', 'Daily Entry Form', 'Flock Management', 'Daily Feed & Water', 'Mortality & Health', 'Egg Production', 'Reports'],
    [Role.Worker]: ['Daily Feed & Water', 'Mortality & Health', 'Egg Production'],
    [Role.Accountant]: ['Dashboard', 'Daily Entry Form', 'Finance Ledger', 'Inventory', 'Reports'],
    [Role.SecurityGuard]: ['Security Gate Log'],
};
