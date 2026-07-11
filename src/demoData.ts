import { Vehicle, Driver, Allotment, FuelEntry, MaintenanceEntry, TokenTaxEntry } from './types';

export const DEMO_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Muhammad Ahmed',
    phone: '0300-1234567',
    licenseNo: 'LHR-87654-A',
    licenseExpiryDate: '2028-04-15',
    assignedDepartment: 'SCM'
  },
  {
    id: 'drv-2',
    name: 'Asif Ali',
    phone: '0321-9876543',
    licenseNo: 'KHI-23456-B',
    licenseExpiryDate: '2027-11-20',
    assignedDepartment: 'Production'
  },
  {
    id: 'drv-3',
    name: 'Zain Ul Abideen',
    phone: '0333-5551122',
    licenseNo: 'ISB-54321-C',
    licenseExpiryDate: '2026-09-10',
    assignedDepartment: 'Sale'
  },
  {
    id: 'drv-4',
    name: 'Tariq Mehmood',
    phone: '0345-4443322',
    licenseNo: 'FSD-34211-D',
    licenseExpiryDate: '2025-12-05',
    assignedDepartment: 'Admin',
    isSelfDrive: true
  },
  {
    id: 'drv-5',
    name: 'Sajid Khan',
    phone: '0312-7778899',
    licenseNo: 'PES-90123-E',
    licenseExpiryDate: '2029-01-30',
    assignedDepartment: 'General'
  },
  {
    id: 'drv-6',
    name: 'Kamran Akmal',
    phone: '0302-6663344',
    licenseNo: 'LHR-11223-X',
    licenseExpiryDate: '2026-08-18',
    assignedDepartment: 'Accounts'
  }
];

export const DEMO_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    vehicleNo: 'LEC-14-4921',
    modelName: 'Toyota Corolla Altis',
    vehicleType: 'Car',
    engineCC: '1600',
    color: 'Super White',
    chassisNo: 'NZE170-9081234',
    engineNo: '1ZR-FE-4821',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-2',
    vehicleNo: 'MNV-20-8812',
    modelName: 'Suzuki Alto VXR',
    vehicleType: 'Car',
    engineCC: '660',
    color: 'Silky Silver',
    chassisNo: 'HA36S-110482',
    engineNo: 'R06A-88219',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-3',
    vehicleNo: 'RIZ-22-1044',
    modelName: 'Honda CD 70',
    vehicleType: 'Motorcycle',
    engineCC: '70',
    color: 'Red',
    chassisNo: 'CD70-1049281',
    engineNo: 'CD70E-92183',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-4',
    vehicleNo: 'PST-18-9023',
    modelName: 'Suzuki APV',
    vehicleType: 'Van',
    engineCC: '1500',
    color: 'Solid Black',
    chassisNo: 'GD415-408921',
    engineNo: 'G15A-90182',
    insuranceStatus: 'Pending'
  },
  {
    id: 'veh-5',
    vehicleNo: 'ISB-19-5566',
    modelName: 'Isuzu NPR Truck',
    vehicleType: 'Truck',
    engineCC: '4300',
    color: 'Blue',
    chassisNo: 'NPR66-701293',
    engineNo: '4HF1-88902',
    insuranceStatus: 'Expired'
  }
];

export const DEMO_ALLOTMENTS: Allotment[] = [
  {
    id: 'alt-1',
    vehicleId: 'veh-1',
    driverId: 'drv-4',
    department: 'Admin',
    allotmentDate: '2026-01-10'
  },
  {
    id: 'alt-2',
    vehicleId: 'veh-2',
    driverId: 'drv-1',
    department: 'SCM',
    allotmentDate: '2026-02-15'
  },
  {
    id: 'alt-3',
    vehicleId: 'veh-5',
    driverId: 'drv-2',
    department: 'Production',
    allotmentDate: '2026-03-01'
  }
];

export const DEMO_FUEL_ENTRIES: FuelEntry[] = [
  // Vehicle 1 (Toyota Corolla) Logs to calculate fuel average
  {
    id: 'fuel-1',
    date: '2026-07-01',
    vehicleId: 'veh-1',
    driverId: 'drv-4',
    litres: 40,
    ratePerLitre: 275,
    totalAmount: 11000,
    odometerReading: 45000,
    pumpName: 'Shell Jail Road, LHR',
    calculatedAverage: undefined
  },
  {
    id: 'fuel-2',
    date: '2026-07-05',
    vehicleId: 'veh-1',
    driverId: 'drv-4',
    litres: 35,
    ratePerLitre: 275,
    totalAmount: 9625,
    odometerReading: 45420, // 420 km diff / 35 L = 12 km/L average
    pumpName: 'PSO Canal Road, LHR',
    calculatedAverage: 12
  },
  {
    id: 'fuel-3',
    date: '2026-07-10',
    vehicleId: 'veh-1',
    driverId: 'drv-4',
    litres: 38,
    ratePerLitre: 272,
    totalAmount: 10336,
    odometerReading: 45850, // 430 km diff / 38 L = 11.3 km/L average
    pumpName: 'Shell Jail Road, LHR',
    calculatedAverage: 11.3
  },
  // Vehicle 2 (Suzuki Alto) Logs
  {
    id: 'fuel-4',
    date: '2026-07-02',
    vehicleId: 'veh-2',
    driverId: 'drv-1',
    litres: 25,
    ratePerLitre: 275,
    totalAmount: 6875,
    odometerReading: 12000,
    pumpName: 'Total Parco DHA, LHR',
    calculatedAverage: undefined
  },
  {
    id: 'fuel-5',
    date: '2026-07-08',
    vehicleId: 'veh-2',
    driverId: 'drv-1',
    litres: 22,
    ratePerLitre: 275,
    totalAmount: 6050,
    odometerReading: 12418, // 418 km diff / 22 L = 19 km/L average
    pumpName: 'PSO Model Town, LHR',
    calculatedAverage: 19
  }
];

export const DEMO_MAINTENANCE_ENTRIES: MaintenanceEntry[] = [
  {
    id: 'maint-1',
    date: '2026-06-20',
    vehicleId: 'veh-1',
    workshopName: 'Toyota Township Motors',
    partsCost: 8500,
    laborCost: 3500,
    totalCost: 12000,
    nextMaintenanceDate: '2026-09-20',
    status: 'Completed'
  },
  {
    id: 'maint-2',
    date: '2026-07-09',
    vehicleId: 'veh-2',
    workshopName: 'Suzuki Canal Motors',
    partsCost: 4500,
    laborCost: 1500,
    totalCost: 6000,
    nextMaintenanceDate: '2026-10-09',
    status: 'Completed'
  },
  {
    id: 'maint-3',
    date: '2026-07-11',
    vehicleId: 'veh-5',
    workshopName: 'Isuzu Ferozepur Workshop',
    partsCost: 32000,
    laborCost: 12000,
    totalCost: 44000,
    nextMaintenanceDate: '2026-08-11',
    status: 'Pending'
  }
];

export const DEMO_TOKEN_TAX_ENTRIES: TokenTaxEntry[] = [
  {
    id: 'tax-1',
    vehicleId: 'veh-1',
    assignedName: 'Muhammad Ahmed',
    tokenStatus: 'Paid',
    startDate: '2026-07-01',
    expiryDate: '2027-06-30'
  },
  {
    id: 'tax-2',
    vehicleId: 'veh-2',
    assignedName: 'Asif Ali',
    tokenStatus: 'Unpaid',
    startDate: '2025-07-01',
    expiryDate: '2026-06-30'
  },
  {
    id: 'tax-3',
    vehicleId: 'veh-4',
    assignedName: 'Sajid Khan',
    tokenStatus: 'Paid',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31'
  }
];
