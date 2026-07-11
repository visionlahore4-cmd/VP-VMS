export interface Vehicle {
  id: string;
  vehicleNo: string; // Plate Number
  modelName: string;
  vehicleType: 'Car' | 'Motorcycle' | 'Van' | 'Truck';
  engineCC: string;
  color: string;
  chassisNo: string;
  engineNo: string;
  insuranceStatus: 'Active' | 'Expired' | 'Pending';
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseExpiryDate: string;
  assignedDepartment: 'General' | 'SCM' | 'Accounts' | 'Sale' | 'Admin' | 'Production';
  isSelfDrive?: boolean;
}

export interface Allotment {
  id: string;
  vehicleId: string;
  driverId: string;
  department: 'General' | 'SCM' | 'Accounts' | 'Sale' | 'Admin' | 'Production';
  allotmentDate: string;
}

export interface FuelEntry {
  id: string;
  date: string;
  vehicleId: string;
  driverId: string;
  litres: number;
  ratePerLitre: number;
  totalAmount: number; // calculated: litres * ratePerLitre rounded
  odometerReading: number;
  pumpName: string;
  calculatedAverage?: number; // km/L, calculated relative to previous odometer reading
}

export interface MaintenanceEntry {
  id: string;
  date: string;
  vehicleId: string;
  workshopName: string;
  partsCost: number;
  laborCost: number;
  totalCost: number; // calculated parts + labor
  nextMaintenanceDate: string;
  status: 'Pending' | 'Completed';
}

export interface TokenTaxEntry {
  id: string;
  vehicleId: string;
  assignedName: string;
  tokenStatus: 'Paid' | 'Unpaid';
  startDate: string;
  expiryDate: string;
}

export interface AppState {
  vehicles: Vehicle[];
  drivers: Driver[];
  allotments: Allotment[];
  fuelEntries: FuelEntry[];
  maintenanceEntries: MaintenanceEntry[];
  tokenTaxEntries: TokenTaxEntry[];
}
