import { Vehicle, Driver, Allotment, FuelEntry, MaintenanceEntry, TokenTaxEntry } from './types';

export const DEMO_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Muhammad Amir Iqbal',
    phone: '0300-4567890',
    licenseNo: 'LHR-99218-A',
    licenseExpiryDate: '2029-06-30',
    assignedDepartment: 'General',
    isSelfDrive: true
  },
  {
    id: 'drv-2',
    name: 'Maj Fazal Ahmad',
    phone: '0321-8899776',
    licenseNo: 'RAW-88123-B',
    licenseExpiryDate: '2028-11-15',
    assignedDepartment: 'Admin',
    isSelfDrive: true
  },
  {
    id: 'drv-3',
    name: 'Col. Fazal-e-Naeem',
    phone: '0333-1122334',
    licenseNo: 'ISB-44321-C',
    licenseExpiryDate: '2027-04-20',
    assignedDepartment: 'Admin',
    isSelfDrive: true
  },
  {
    id: 'drv-4',
    name: 'Muhammad Babar',
    phone: '0345-5556677',
    licenseNo: 'FSD-33441-D',
    licenseExpiryDate: '2029-01-10',
    assignedDepartment: 'SCM',
    isSelfDrive: true
  },
  {
    id: 'drv-5',
    name: 'Adnan Ali',
    phone: '0302-9988776',
    licenseNo: 'LHR-10293-F',
    licenseExpiryDate: '2028-09-05',
    assignedDepartment: 'Accounts',
    isSelfDrive: true
  },
  {
    id: 'drv-6',
    name: 'Ammar Saeed',
    phone: '0322-4433221',
    licenseNo: 'MUL-90231-G',
    licenseExpiryDate: '2029-03-25',
    assignedDepartment: 'Production',
    isSelfDrive: true
  },
  {
    id: 'drv-7',
    name: 'Abdul Sattar',
    phone: '0312-3344556',
    licenseNo: 'LHR-77218-K',
    licenseExpiryDate: '2028-12-12',
    assignedDepartment: 'Production',
    isSelfDrive: true
  },
  {
    id: 'drv-8',
    name: 'M Mohsin Khan',
    phone: '0336-7766554',
    licenseNo: 'LHR-30491-M',
    licenseExpiryDate: '2027-08-30',
    assignedDepartment: 'Admin',
    isSelfDrive: true
  },
  {
    id: 'drv-9',
    name: 'Bilal Manzoor',
    phone: '0344-9900112',
    licenseNo: 'ISB-20193-Y',
    licenseExpiryDate: '2026-10-18',
    assignedDepartment: 'General',
    isSelfDrive: true
  },
  {
    id: 'drv-10',
    name: 'Haris Nasir Mahmood',
    phone: '0300-8811223',
    licenseNo: 'LHR-55432-Z',
    licenseExpiryDate: '2029-05-15',
    assignedDepartment: 'Sale',
    isSelfDrive: true
  },
  {
    id: 'drv-11',
    name: 'Mehboob ur Rehman',
    phone: '0321-4455667',
    licenseNo: 'KHI-99234-W',
    licenseExpiryDate: '2028-02-28',
    assignedDepartment: 'Sale',
    isSelfDrive: true
  },
  {
    id: 'drv-12',
    name: 'Hassan Gradezi',
    phone: '0334-7788990',
    licenseNo: 'MUL-10294-X',
    licenseExpiryDate: '2027-06-14',
    assignedDepartment: 'Sale',
    isSelfDrive: true
  },
  {
    id: 'drv-13',
    name: 'Faizan Akram',
    phone: '0315-1122334',
    licenseNo: 'FSD-44521-E',
    licenseExpiryDate: '2028-10-09',
    assignedDepartment: 'Sale',
    isSelfDrive: true
  },
  {
    id: 'drv-14',
    name: 'Abdul Moeed Chughtai',
    phone: '0300-5544332',
    licenseNo: 'LHR-88231-P',
    licenseExpiryDate: '2029-04-24',
    assignedDepartment: 'Sale',
    isSelfDrive: true
  },
  {
    id: 'drv-15',
    name: 'Tariq Mehmood',
    phone: '0345-4443322',
    licenseNo: 'FSD-34211-D',
    licenseExpiryDate: '2027-12-05',
    assignedDepartment: 'Admin',
    isSelfDrive: false
  },
  {
    id: 'drv-16',
    name: 'Sajid Khan',
    phone: '0312-7778899',
    licenseNo: 'PES-90123-E',
    licenseExpiryDate: '2029-01-30',
    assignedDepartment: 'Sale',
    isSelfDrive: false
  },
  {
    id: 'drv-17',
    name: 'Zaheer Abbas',
    phone: '0301-1122334',
    licenseNo: 'LHR-88712-R',
    licenseExpiryDate: '2028-05-12',
    assignedDepartment: 'SCM',
    isSelfDrive: false
  }
];

export const DEMO_VEHICLES: Vehicle[] = [
  // General Vehicles (1-9)
  {
    id: 'veh-1',
    vehicleNo: 'ARX-361',
    modelName: 'Toyota / Grande',
    vehicleType: 'Car',
    engineCC: '1800 CC',
    color: 'White',
    chassisNo: 'ZRE172R7068921',
    engineNo: 'Q369710',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-2',
    vehicleNo: 'AEE-863',
    modelName: 'Toyota / Grande',
    vehicleType: 'Car',
    engineCC: '1800 CC',
    color: 'Phantan Brown',
    chassisNo: 'NZE170R-4135350',
    engineNo: 'Z509585',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-3',
    vehicleNo: 'AFX-196',
    modelName: 'Toyota / GLI',
    vehicleType: 'Car',
    engineCC: '1300 CC',
    color: 'White',
    chassisNo: 'ZRE172R7023104',
    engineNo: 'Q324008',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-4',
    vehicleNo: 'ATG-620',
    modelName: 'Suzuki Swift (GL cvt)',
    vehicleType: 'Car',
    engineCC: '1200 CC',
    color: 'White',
    chassisNo: '203974',
    engineNo: '1021311',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-5',
    vehicleNo: 'AVD-597',
    modelName: 'Suzuki Swift (GLX cvt)',
    vehicleType: 'Car',
    engineCC: '1200 CC',
    color: 'White',
    chassisNo: 'NF1SZC63S00209449',
    engineNo: 'K12MR1026794',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-6',
    vehicleNo: 'AWM-981',
    modelName: 'Suzuki Swift (GL vvt)',
    vehicleType: 'Car',
    engineCC: '1200 CC',
    color: 'White',
    chassisNo: 'NF1SZC63500210884',
    engineNo: 'K12MR1028201',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-7',
    vehicleNo: 'ARQ-965',
    modelName: 'Suzuki / Wagon-R',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'A1J310PK10147415',
    engineNo: 'BK10B247435',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-8',
    vehicleNo: 'LEB-1197',
    modelName: 'Suzuki / Cultus',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'NF1AVK31H10026695',
    engineNo: 'PK10K126706',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-9',
    vehicleNo: 'AVX-481',
    modelName: 'Suzuki / Every',
    vehicleType: 'Van',
    engineCC: '660 CC',
    color: 'White',
    chassisNo: 'NF1ADE17V00104066',
    engineNo: 'R06AR1004065',
    insuranceStatus: 'Active'
  },
  // Sale Department (10-16)
  {
    id: 'veh-10',
    vehicleNo: 'BSD-020',
    modelName: 'Toyota / Grande',
    vehicleType: 'Car',
    engineCC: '1600 CC',
    color: 'White',
    chassisNo: 'ZRE171R6092228',
    engineNo: 'Q114679',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-11',
    vehicleNo: 'LEA-2850',
    modelName: 'Toyota / Grande',
    vehicleType: 'Car',
    engineCC: '1600 CC',
    color: 'White',
    chassisNo: 'ZRE171R-6027513',
    engineNo: '1ZR-FE1598',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-12',
    vehicleNo: 'ART-528',
    modelName: 'Suzuki / Cultus',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'NF1AVK31H10110064',
    engineNo: 'PK10K210082',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-13',
    vehicleNo: 'ART-547',
    modelName: 'Suzuki / Cultus',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'NF1AVK31H10110044',
    engineNo: 'PK10K210061',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-14',
    vehicleNo: 'LEB-1204',
    modelName: 'Suzuki / Cultus',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'NF1AVK31H10025584',
    engineNo: 'PK10K125604',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-15',
    vehicleNo: 'ARQ-526',
    modelName: 'Suzuki / Wagon-R',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'A1J310PK10147408',
    engineNo: 'PK10B247425',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-16',
    vehicleNo: 'ARQ-334',
    modelName: 'Suzuki / Wagon-R',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'White',
    chassisNo: 'A1J310PK10147416',
    engineNo: 'BK10B247443',
    insuranceStatus: 'Active'
  },
  // Admin and Loading (17-25)
  {
    id: 'veh-17',
    vehicleNo: 'LEA-6860',
    modelName: 'Toyota / GLI',
    vehicleType: 'Car',
    engineCC: '1300 CC',
    color: 'White',
    chassisNo: 'NZE170R-4097717',
    engineNo: 'Z471575',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-18',
    vehicleNo: 'LEB-5449',
    modelName: 'Toyota / yaris',
    vehicleType: 'Car',
    engineCC: '1300 CC',
    color: 'White',
    chassisNo: 'NSP150R7001654',
    engineNo: '2A03272',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-19',
    vehicleNo: 'LE-3153',
    modelName: 'Toyota / Vitz',
    vehicleType: 'Car',
    engineCC: '1000 CC',
    color: 'Sky Blue',
    chassisNo: 'KPS1302096955',
    engineNo: 'IKR1430064',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-20',
    vehicleNo: 'AFS-612',
    modelName: 'Suzuki / Bolan',
    vehicleType: 'Van',
    engineCC: '800 CC',
    color: 'White',
    chassisNo: 'SV308PK01132851',
    engineNo: 'PKT1016339',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-21',
    vehicleNo: 'BPR-980',
    modelName: 'Changan / Carwan',
    vehicleType: 'Van',
    engineCC: '1200 CC',
    color: 'White',
    chassisNo: 'NKMAAB3R3S1001588',
    engineNo: 'JL473QS30C508312',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-22',
    vehicleNo: 'CAJ-6701',
    modelName: 'Suzuki / Ravi',
    vehicleType: 'Truck',
    engineCC: '850 CC',
    color: 'White',
    chassisNo: 'SR308PK488376',
    engineNo: 'PKT383713',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-23',
    vehicleNo: 'CAV-8213',
    modelName: 'Hyundai / Porter',
    vehicleType: 'Truck',
    engineCC: '2600 CC',
    color: 'White',
    chassisNo: 'PMFZBX7BLRN108171',
    engineNo: 'D4BBR014905',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-24',
    vehicleNo: 'CAF-4893',
    modelName: 'Hyundai / Porter',
    vehicleType: 'Truck',
    engineCC: '2600 CC',
    color: 'White',
    chassisNo: 'PMFZBX7BLMN101385',
    engineNo: 'D4BBM001318',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-25',
    vehicleNo: 'LES-4605',
    modelName: 'Hino Truck',
    vehicleType: 'Truck',
    engineCC: '4000 CC',
    color: 'White',
    chassisNo: 'JHHYJLOHX02003240',
    engineNo: 'WO4DTNM14157',
    insuranceStatus: 'Active'
  },
  // Pre-seeded Bikes/Motorcycles for the newly added Sidebar Option
  {
    id: 'veh-bike-1',
    vehicleNo: 'LHO-26-4412',
    modelName: 'Honda CD 70',
    vehicleType: 'Motorcycle',
    engineCC: '70 CC',
    color: 'Red',
    chassisNo: 'CD70-8812733',
    engineNo: 'CD70E-481921',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-bike-2',
    vehicleNo: 'LRN-25-8822',
    modelName: 'Honda CG 125',
    vehicleType: 'Motorcycle',
    engineCC: '125 CC',
    color: 'Black',
    chassisNo: 'CG125-9921822',
    engineNo: 'CG125E-501822',
    insuranceStatus: 'Active'
  },
  {
    id: 'veh-bike-3',
    vehicleNo: 'LEM-24-3011',
    modelName: 'Yamaha YBR 125',
    vehicleType: 'Motorcycle',
    engineCC: '125 CC',
    color: 'Blue',
    chassisNo: 'YBR125-1102931',
    engineNo: 'YBR125E-901822',
    insuranceStatus: 'Active'
  }
];

export const DEMO_ALLOTMENTS: Allotment[] = [
  {
    id: 'alt-1',
    vehicleId: 'veh-1',
    driverId: 'drv-1',
    department: 'General',
    allotmentDate: '2026-01-10'
  },
  {
    id: 'alt-2',
    vehicleId: 'veh-2',
    driverId: 'drv-2',
    department: 'Admin',
    allotmentDate: '2026-02-15'
  },
  {
    id: 'alt-3',
    vehicleId: 'veh-3',
    driverId: 'drv-3',
    department: 'Admin',
    allotmentDate: '2026-03-01'
  },
  {
    id: 'alt-4',
    vehicleId: 'veh-4',
    driverId: 'drv-4',
    department: 'SCM',
    allotmentDate: '2026-04-12'
  },
  {
    id: 'alt-5',
    vehicleId: 'veh-5',
    driverId: 'drv-5',
    department: 'Accounts',
    allotmentDate: '2026-05-18'
  },
  {
    id: 'alt-6',
    vehicleId: 'veh-10',
    driverId: 'drv-10',
    department: 'Sale',
    allotmentDate: '2026-06-01'
  },
  {
    id: 'alt-7',
    vehicleId: 'veh-11',
    driverId: 'drv-11',
    department: 'Sale',
    allotmentDate: '2026-06-15'
  },
  {
    id: 'alt-8',
    vehicleId: 'veh-bike-1',
    driverId: 'drv-17',
    department: 'SCM',
    allotmentDate: '2026-07-01'
  }
];

export const DEMO_FUEL_ENTRIES: FuelEntry[] = [
  {
    id: 'fuel-1',
    date: '2026-07-01',
    vehicleId: 'veh-1',
    driverId: 'drv-1',
    litres: 45,
    ratePerLitre: 275,
    totalAmount: 12375,
    odometerReading: 12000,
    pumpName: 'Shell Sunder Industrial Estate',
    calculatedAverage: undefined
  },
  {
    id: 'fuel-2',
    date: '2026-07-05',
    vehicleId: 'veh-1',
    driverId: 'drv-1',
    litres: 42,
    ratePerLitre: 275,
    totalAmount: 11550,
    odometerReading: 12510,
    pumpName: 'PSO Canal Road, LHR',
    calculatedAverage: 12.1
  },
  {
    id: 'fuel-3',
    date: '2026-07-03',
    vehicleId: 'veh-bike-1',
    driverId: 'drv-17',
    litres: 8.5,
    ratePerLitre: 275,
    totalAmount: 2338,
    odometerReading: 4500,
    pumpName: 'Total Parco Multan Road',
    calculatedAverage: undefined
  },
  {
    id: 'fuel-4',
    date: '2026-07-10',
    vehicleId: 'veh-bike-1',
    driverId: 'drv-17',
    litres: 8.0,
    ratePerLitre: 272,
    totalAmount: 2176,
    odometerReading: 4840,
    pumpName: 'Total Parco Multan Road',
    calculatedAverage: 42.5
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
    vehicleId: 'veh-bike-1',
    workshopName: 'Honda Sunder Point',
    partsCost: 1200,
    laborCost: 500,
    totalCost: 1700,
    nextMaintenanceDate: '2026-08-09',
    status: 'Completed'
  }
];

export const DEMO_TOKEN_TAX_ENTRIES: TokenTaxEntry[] = [
  {
    id: 'tax-1',
    vehicleId: 'veh-1',
    assignedName: 'Muhammad Amir Iqbal',
    tokenStatus: 'Paid',
    startDate: '2026-07-01',
    expiryDate: '2027-06-30'
  },
  {
    id: 'tax-2',
    vehicleId: 'veh-bike-1',
    assignedName: 'Zaheer Abbas',
    tokenStatus: 'Paid',
    startDate: '2025-07-01',
    expiryDate: '2026-06-30'
  }
];
