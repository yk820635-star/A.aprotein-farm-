export enum Role {
    Admin = 'Admin',
    Manager = 'Manager',
    Worker = 'Worker',
    Accountant = 'Accountant',
    SecurityGuard = 'Security Guard',
}

export interface User {
    username: string;
    role: Role;
}

export type Page = 
    | 'Dashboard' 
    | 'Flock Management' 
    | 'Daily Feed & Water' 
    | 'Mortality & Health' 
    | 'Egg Production' 
    | 'Finance Ledger' 
    | 'Inventory' 
    | 'Security Gate Log' 
    | 'Reports'
    | 'Daily Entry Form';

export interface Flock {
    id: string;
    name: string;
    breed: string;
    arrivalDate: string;
    initialBirdCount: number;
    currentBirdCount: number;
    costPerChick: number;
    totalMortality: number;
    totalFeed: number;
    totalEggs: number;
}

export interface DailyFeedReport {
    id: string;
    date: string;
    flockId: string;
    feedConsumedPerBird: number; // in grams per bird
    waterConsumedNormal: number; // in liters
    waterConsumedMedicated: number; // in liters
    openingStockFeed: number; // in kg
    feedReceived: number; // in kg
    totalFeedUsed: number; // in kg
    remarks: string;
}

export interface MortalityReport {
    id: string;
    date: string;
    flockId: string;
    nightMortality: number;
    hospitalMortality: number;
    total: number;
    remarks: string;
}

export interface MedicineReport {
    id: string;
    date: string;
    flockId: string;
    medicineName: string;
    dose: string;
    medicineUsed: string;
    totalHours: string;
    remarks: string;
}

export interface EggStock {
    petti: number;
    tray: number;
    eggs: number;
}

export interface EggCategoryProduction {
    opening: EggStock;
    today: EggStock;
    sale: EggStock;
}

export interface EggProductionReport {
    id:string;
    date: string;
    flockId: string;
    starter: EggCategoryProduction;
    medium: EggCategoryProduction;
    standard: EggCategoryProduction;
    jumbo: EggCategoryProduction;
    dirty: EggCategoryProduction;
    broken: EggCategoryProduction;
    liquid: EggCategoryProduction;
}


export enum TransactionType {
    Inward = 'Inward',
    Outward = 'Outward',
}

export interface FinanceTransaction {
    id: string;
    date: string;
    voucherNo: string;
    type: TransactionType;
    sourceOrExpenseType: string;
    amount: number;
    remarks: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: 'Feed' | 'Medicine' | 'Trays' | 'Packaging' | 'Diesel' | 'Other';
    unit: 'kg' | 'liters' | 'units' | 'bottles';
    stock: number;
    lowStockThreshold: number;
    supplier: string;
}

export enum GateMovementType {
    Inward = 'Inward',
    Outward = 'Outward',
}

export interface SecurityLog {
    id: string;
    timestamp: string;
    type: GateMovementType;
    vehicleNumber: string;
    driverName: string;
    materialType: string;
    quantity: string;
    photoOrDocUrl?: string; // a URL to the uploaded file
}
