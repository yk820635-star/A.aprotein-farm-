import { Flock, DailyFeedReport, MortalityReport, EggProductionReport, FinanceTransaction, InventoryItem, SecurityLog, Role, GateMovementType, TransactionType, Page, MedicineReport, EggStock } from './types';

// --- Dynamic Date Generation ---
const generateDateStr = (offset = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return date.toISOString().split('T')[0];
};

const DATES = {
    today: generateDateStr(0),
    yesterday: generateDateStr(1),
    d2: generateDateStr(2),
    d3: generateDateStr(3),
    d4: generateDateStr(4),
    d5: generateDateStr(5),
    d6: generateDateStr(6),
};


// --- Mock Data ---

export const MOCK_FLOCKS: Flock[] = [
    { id: 'h1', name: 'H1', breed: 'Lohmann Brown', arrivalDate: '2023-01-15', initialBirdCount: 5000, currentBirdCount: 4850, costPerChick: 120, totalMortality: 150, totalFeed: 55000, totalEggs: 950000 },
    { id: 'h2', name: 'H2', breed: 'Hy-Line Brown', arrivalDate: '2023-03-20', initialBirdCount: 5000, currentBirdCount: 4910, costPerChick: 125, totalMortality: 90, totalFeed: 52000, totalEggs: 925000 },
    { id: 'h3', name: 'H3', breed: 'ISA Brown', arrivalDate: '2023-06-10', initialBirdCount: 5000, currentBirdCount: 4950, costPerChick: 122, totalMortality: 50, totalFeed: 48000, totalEggs: 890000 },
];

export const MOCK_FEED_REPORTS: DailyFeedReport[] = [
    { id: 'fr1', date: DATES.today, flockId: 'h1', feedConsumedPerBird: 110, waterConsumedNormal: 800, waterConsumedMedicated: 0, openingStockFeed: 1500, feedReceived: 500, totalFeedUsed: 533.5, remarks: 'Normal consumption' },
    { id: 'fr2', date: DATES.today, flockId: 'h2', feedConsumedPerBird: 112, waterConsumedNormal: 810, waterConsumedMedicated: 0, openingStockFeed: 1800, feedReceived: 0, totalFeedUsed: 550, remarks: 'Slightly increased water intake' },
    ...[...Array(6)].map((_, i) => ({
        id: `fr-hist-${i}`,
        date: generateDateStr(i + 1),
        flockId: ['h1', 'h2', 'h3'][i % 3],
        feedConsumedPerBird: 108 + i,
        waterConsumedNormal: 790 - (i*5),
        waterConsumedMedicated: 0,
        openingStockFeed: 2033 + (i*100),
        feedReceived: i % 2 === 0 ? 500 : 0,
        totalFeedUsed: 523 + (i*2),
        remarks: 'Historical data'
    }))
];

export const MOCK_MORTALITY_REPORTS: MortalityReport[] = [
    { id: 'mr1', date: DATES.today, flockId: 'h1', nightMortality: 2, hospitalMortality: 1, total: 3, remarks: 'Normal mortality rate' },
    { id: 'mr2', date: DATES.yesterday, flockId: 'h1', nightMortality: 1, hospitalMortality: 1, total: 2, remarks: 'Routine check' },
];

export const MOCK_MEDICINE_REPORTS: MedicineReport[] = [
    { id: 'medr1', date: DATES.today, flockId: 'h1', medicineName: 'Kanamycin', dose: '1ml/L', medicineUsed: '4 Bottles', totalHours: '2 hrs', remarks: 'For respiratory issues' },
];

const emptyEggStock: EggStock = { petti: 0, tray: 0, eggs: 0 };
const emptyEggCategory = { opening: { petti: 5, tray: 10, eggs: 0}, today: emptyEggStock, sale: { petti: 5, tray: 0, eggs: 0} };

const generateEggReport = (date: string, flockId: string, id: string): EggProductionReport => ({
    id,
    date,
    flockId,
    starter: { ...emptyEggCategory, today: { petti: 0, tray: 3 + Math.floor(Math.random() * 2), eggs: 10 + Math.floor(Math.random() * 5) } },
    medium: { ...emptyEggCategory, today: { petti: 2, tray: 20 + Math.floor(Math.random() * 5), eggs: 0 + Math.floor(Math.random() * 5) } },
    standard: { ...emptyEggCategory, today: { petti: 9, tray: 23 + Math.floor(Math.random() * 3), eggs: 4 + Math.floor(Math.random() * 5) } },
    jumbo: { ...emptyEggCategory, today: { petti: 1, tray: 3 + Math.floor(Math.random() * 2), eggs: 4 + Math.floor(Math.random() * 5) } },
    broken: { ...emptyEggCategory, today: { petti: 0, tray: 1, eggs: 20 + Math.floor(Math.random() * 5) } },
    dirty: { ...emptyEggCategory },
    liquid: { ...emptyEggCategory, today: { petti: 0, tray: 0, eggs: 10 + Math.floor(Math.random() * 5) } },
});


export const MOCK_EGG_REPORTS: EggProductionReport[] = [
    generateEggReport(DATES.today, 'h1', 'er1'),
    generateEggReport(DATES.today, 'h2', 'er1-2'),
    generateEggReport(DATES.today, 'h3', 'er1-3'),
    generateEggReport(DATES.yesterday, 'h1', 'er2'),
    generateEggReport(DATES.yesterday, 'h2', 'er2-2'),
    generateEggReport(DATES.yesterday, 'h3', 'er2-3'),
    generateEggReport(DATES.d2, 'h1', 'er3-1'),
    generateEggReport(DATES.d2, 'h2', 'er3-2'),
    generateEggReport(DATES.d3, 'h1', 'er4'),
    generateEggReport(DATES.d4, 'h2', 'er5'),
    generateEggReport(DATES.d5, 'h1', 'er6'),
    generateEggReport(DATES.d6, 'h3', 'er7'),
];

export const MOCK_FINANCE_TRANSACTIONS: FinanceTransaction[] = [
    { id: 'ft1', date: DATES.today, voucherNo: 'IN-001', type: TransactionType.Inward, sourceOrExpenseType: 'Egg Sales - Local Market', amount: 55000, remarks: 'Payment from Tariq Traders' },
    { id: 'ft2', date: DATES.today, voucherNo: 'OUT-001', type: TransactionType.Outward, sourceOrExpenseType: 'Feed Purchase', amount: 120000, remarks: 'Paid to Punjab Feeds' },
    { id: 'ft3', date: DATES.today, voucherNo: 'OUT-002', type: TransactionType.Outward, sourceOrExpenseType: 'Diesel', amount: 5000, remarks: 'For generator' },
    { id: 'ft4', date: DATES.yesterday, voucherNo: 'IN-000', type: TransactionType.Inward, sourceOrExpenseType: 'Egg Sales - Retail', amount: 48000, remarks: 'Cash sale' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv1', name: 'Layer Feed A', category: 'Feed', unit: 'kg', stock: 15000, lowStockThreshold: 5000, supplier: 'Punjab Feeds' },
    { id: 'inv2', name: 'Calcium Vita', category: 'Medicine', unit: 'bottles', stock: 50, lowStockThreshold: 10, supplier: 'Pharma Solutions' },
    { id: 'inv3', name: 'Egg Trays', category: 'Trays', unit: 'units', stock: 20000, lowStockThreshold: 5000, supplier: 'Packaging Co.' },
];

export const MOCK_SECURITY_LOGS: SecurityLog[] = [
    { id: 'sl1', timestamp: new Date(new Date().setHours(9, 15, 23)).toISOString(), type: GateMovementType.Inward, vehicleNumber: 'MNC-1234', driverName: 'Ali Khan', materialType: 'Feed', quantity: '200 bags', photoOrDocUrl: 'https://picsum.photos/200' },
    { id: 'sl2', timestamp: new Date(new Date().setHours(11, 45, 5)).toISOString(), type: GateMovementType.Outward, vehicleNumber: 'LET-5678', driverName: 'Bilal Ahmed', materialType: 'Eggs', quantity: '500 trays', photoOrDocUrl: 'https://picsum.photos/201' },
];

export const ROLE_PERMISSIONS: Record<Role, Page[]> = {
    [Role.Admin]: ['Dashboard', 'Daily Entry Form', 'Flock Management', 'Daily Feed & Water', 'Mortality & Health', 'Egg Production', 'Finance Ledger', 'Inventory', 'Security Gate Log', 'Reports'],
    [Role.Manager]: ['Dashboard', 'Daily Entry Form', 'Flock Management', 'Daily Feed & Water', 'Mortality & Health', 'Egg Production', 'Reports'],
    [Role.Worker]: ['Daily Feed & Water', 'Mortality & Health', 'Egg Production'],
    [Role.Accountant]: ['Dashboard', 'Daily Entry Form', 'Finance Ledger', 'Inventory', 'Reports'],
    [Role.SecurityGuard]: ['Security Gate Log'],
};