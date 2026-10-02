export const INDIAN_STATES = [
  { code: '01', name: 'Jammu & Kashmir', isUT: true },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh', isUT: true },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi', isUT: true },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '25', name: 'Daman & Diu and Dadra & Nagar Haveli', isUT: true },
  { code: '26', name: 'Maharashtra' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep', isUT: true },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry', isUT: true },
  { code: '35', name: 'Andaman & Nicobar Islands', isUT: true },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh', isUT: true },
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const UNITS = [
  'PCS (Pieces)',
  'NOS (Numbers)',
  'KGS (Kilograms)',
  'GMS (Grams)',
  'QTL (Quintal)',
  'MTR (Meters)',
  'SQF (Square Feet)',
  'SQM (Square Meter)',
  'LTR (Litres)',
  'BOX (Boxes)',
  'BAG (Bags)',
  'SET (Sets)',
  'HRS (Hours)',
  'DAYS (Days)',
  'MTH (Months)',
  'SRV (Services)',
  'JOB (Job Work)',
];

export const COMMON_HSN_SAC = [
  { code: '998311', label: 'IT Consulting & Software Support Services (SAC 998311)' },
  { code: '998313', label: 'Website Design & Development Services (SAC 998313)' },
  { code: '998314', label: 'Digital Marketing & Advertising (SAC 998314)' },
  { code: '998221', label: 'Accounting & Bookkeeping Services (SAC 998221)' },
  { code: '998211', label: 'Legal Advisory & Representation (SAC 998211)' },
  { code: '998399', label: 'General Management Consulting (SAC 998399)' },
  { code: '847130', label: 'Laptops, Tablets & Data Processing Units (HSN 847130)' },
  { code: '851713', label: 'Smartphones & Mobile Devices (HSN 851713)' },
  { code: '610910', label: 'Cotton T-Shirts & Garments (HSN 610910)' },
  { code: '090240', label: 'Tea & Spices (HSN 090240)' },
  { code: '482010', label: 'Registers, Notebooks & Paper Stationery (HSN 482010)' },
  { code: '940330', label: 'Wooden Office & Commercial Furniture (HSN 940330)' },
  { code: '300490', label: 'Pharmaceutical & Medicaments (HSN 300490)' },
  { code: '870829', label: 'Automobile Spare Parts & Components (HSN 870829)' },
];

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Salary',
  'Marketing',
  'Electricity',
  'Internet',
  'Travel',
  'Inventory',
  'Office',
  'Software',
  'Raw Materials',
  'Other',
] as const;

export const DEFAULT_TERMS = `1. Payment is due within 15 days of invoice date.
2. Please make payments via UPI or Bank NEFT/RTGS to the account details specified.
3. Interest @ 18% per annum will be charged on delayed payments after the due date.
4. Goods once sold will not be taken back or exchanged without prior authorization.
5. All disputes are subject to local jurisdiction only.`;

export const DEFAULT_DISCLAIMER = `BizTools India provides calculation and document-generation tools for convenience. Users are responsible for verifying tax, accounting and legal requirements applicable to their business.`;
