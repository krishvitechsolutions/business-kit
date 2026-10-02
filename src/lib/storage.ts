import {
  BusinessProfile,
  Invoice,
  Quotation,
  PurchaseOrder,
  Receipt,
  SalarySlip,
  BusinessCardData,
  WhatsAppCatalogue,
  Expense,
  ContactMessage,
  DeliveryChallan,
} from './types';
import { numberToWordsIndian } from './utils';

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  id: 'bp-demo-001',
  businessName: 'Apex Infotech Solutions',
  ownerName: 'Rajesh Sharma',
  businessLogo: '',
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'billing@apexinfotech.in',
  website: 'https://apexinfotech.in',
  address: 'No. 42, 3rd Floor, Tech Park Boulevard, Koramangala',
  state: 'Karnataka',
  city: 'Bengaluru',
  pincode: '560034',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50200012345678',
  ifsc: 'HDFC0001234',
  accountHolderName: 'Apex Infotech Solutions',
  upiId: 'apexinfotech@hdfcbank',
  upiQrEnabled: true,
  termsAndConditions: `1. Payment due within 15 days of invoice date.
2. Please transfer funds to the bank account or scan the UPI QR code.
3. Interest @ 18% per annum will be charged on overdue accounts.
4. Disputes are subject to Bengaluru jurisdiction only.`,
  notes: 'Thank you for choosing Apex Infotech Solutions for your business growth!',
};

const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    userId: 'user-01',
    invoiceNumber: 'INV-2026-089',
    invoiceDate: '2026-09-28',
    dueDate: '2026-10-15',
    status: 'paid',
    templateId: 'modern',
    seller: DEFAULT_BUSINESS_PROFILE,
    customerName: 'Bharat Retail Tech Private Limited',
    customerGstin: '29AABCB9876C1Z3',
    customerPan: 'AABCB9876C',
    customerPhone: '+91 98450 11223',
    customerEmail: 'finance@bharatretailtech.com',
    customerAddress: 'Floor 5, Prestige Tower, MG Road',
    customerState: 'Karnataka',
    customerCity: 'Bengaluru',
    customerPincode: '560001',
    placeOfSupply: 'Karnataka',
    isInterState: false,
    isReverseCharge: false,
    paymentTerms: 'Net 15 Days',
    items: [
      {
        id: 'item-1',
        name: 'Enterprise Cloud ERP Customization',
        description: 'Custom module development and API integration',
        hsnSac: '998311',
        quantity: 1,
        unit: 'SRV (Services)',
        rate: 85000,
        discount: 5,
        discountType: 'percent',
        gstRate: 18,
        amount: 80750,
      },
      {
        id: 'item-2',
        name: 'Monthly Dedicated DevOps Support (Sep 2026)',
        description: '24/7 server monitoring and database backup services',
        hsnSac: '998313',
        quantity: 1,
        unit: 'MTH (Months)',
        rate: 25000,
        discount: 0,
        discountType: 'percent',
        gstRate: 18,
        amount: 25000,
      },
    ],
    subtotal: 110000,
    totalDiscount: 4250,
    taxableAmount: 105750,
    cgst: 9517.5,
    sgst: 9517.5,
    igst: 0,
    totalTax: 19035,
    roundOff: 0,
    grandTotal: 124785,
    amountInWords: numberToWordsIndian(124785),
    notes: 'Payment received with thanks via NEFT on 30 Sep 2026.',
    terms: DEFAULT_BUSINESS_PROFILE.termsAndConditions || '',
    bankDetails: {
      bankName: DEFAULT_BUSINESS_PROFILE.bankName || '',
      accountNumber: DEFAULT_BUSINESS_PROFILE.accountNumber || '',
      ifsc: DEFAULT_BUSINESS_PROFILE.ifsc || '',
      holderName: DEFAULT_BUSINESS_PROFILE.accountHolderName || '',
      upiId: DEFAULT_BUSINESS_PROFILE.upiId || '',
    },
    createdAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-30T14:30:00.000Z',
  },
  {
    id: 'inv-102',
    userId: 'user-01',
    invoiceNumber: 'INV-2026-090',
    invoiceDate: '2026-10-01',
    dueDate: '2026-10-16',
    status: 'unpaid',
    templateId: 'indigo',
    seller: DEFAULT_BUSINESS_PROFILE,
    customerName: 'Kaveri Logistics & Transport Corp',
    customerGstin: '33AABCK4433D1Z9',
    customerPan: 'AABCK4433D',
    customerPhone: '+91 97100 44556',
    customerEmail: 'accounts@kaverilogistics.in',
    customerAddress: 'Plot 18, Guindy Industrial Estate',
    customerState: 'Tamil Nadu',
    customerCity: 'Chennai',
    customerPincode: '600032',
    placeOfSupply: 'Tamil Nadu',
    isInterState: true,
    isReverseCharge: false,
    paymentTerms: 'Due on Receipt',
    items: [
      {
        id: 'item-3',
        name: 'Fleet Management GPS Dashboard Web Application',
        description: 'React + Node tracking interface with real-time alerts',
        hsnSac: '998314',
        quantity: 1,
        unit: 'JOB (Job Work)',
        rate: 65000,
        discount: 0,
        discountType: 'percent',
        gstRate: 18,
        amount: 65000,
      },
    ],
    subtotal: 65000,
    totalDiscount: 0,
    taxableAmount: 65000,
    cgst: 0,
    sgst: 0,
    igst: 11700,
    totalTax: 11700,
    roundOff: 0,
    grandTotal: 76700,
    amountInWords: numberToWordsIndian(76700),
    notes: 'Please quote invoice number INV-2026-090 in all bank transfer references.',
    terms: DEFAULT_BUSINESS_PROFILE.termsAndConditions || '',
    bankDetails: {
      bankName: DEFAULT_BUSINESS_PROFILE.bankName || '',
      accountNumber: DEFAULT_BUSINESS_PROFILE.accountNumber || '',
      ifsc: DEFAULT_BUSINESS_PROFILE.ifsc || '',
      holderName: DEFAULT_BUSINESS_PROFILE.accountHolderName || '',
      upiId: DEFAULT_BUSINESS_PROFILE.upiId || '',
    },
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'inv-103',
    userId: 'user-01',
    invoiceNumber: 'INV-2026-091',
    invoiceDate: '2026-10-02',
    dueDate: '2026-10-20',
    status: 'sent',
    templateId: 'classic',
    seller: DEFAULT_BUSINESS_PROFILE,
    customerName: 'Shree Balaji Traders & Wholesalers',
    customerGstin: '27AABCS5566G1Z2',
    customerPhone: '+91 98200 99887',
    customerEmail: 'balajitraderz@gmail.com',
    customerAddress: 'Shop 12, APMC Market Yard, Vashi',
    customerState: 'Maharashtra',
    customerCity: 'Navi Mumbai',
    customerPincode: '400703',
    placeOfSupply: 'Maharashtra',
    isInterState: true,
    isReverseCharge: false,
    paymentTerms: 'Net 15 Days',
    items: [
      {
        id: 'item-4',
        name: 'Inventory Barcode Scanner & POS Software License',
        description: 'Annual multi-terminal license for billing counters',
        hsnSac: '847130',
        quantity: 2,
        unit: 'SET (Sets)',
        rate: 22000,
        discount: 10,
        discountType: 'percent',
        gstRate: 18,
        amount: 39600,
      },
    ],
    subtotal: 44000,
    totalDiscount: 4400,
    taxableAmount: 39600,
    cgst: 0,
    sgst: 0,
    igst: 7128,
    totalTax: 7128,
    roundOff: 0,
    grandTotal: 46728,
    amountInWords: numberToWordsIndian(46728),
    notes: 'Thank you for your business. For support contact +91 98765 43210.',
    terms: DEFAULT_BUSINESS_PROFILE.termsAndConditions || '',
    bankDetails: {
      bankName: DEFAULT_BUSINESS_PROFILE.bankName || '',
      accountNumber: DEFAULT_BUSINESS_PROFILE.accountNumber || '',
      ifsc: DEFAULT_BUSINESS_PROFILE.ifsc || '',
      holderName: DEFAULT_BUSINESS_PROFILE.accountHolderName || '',
      upiId: DEFAULT_BUSINESS_PROFILE.upiId || '',
    },
    createdAt: '2026-10-02T11:00:00.000Z',
    updatedAt: '2026-10-02T11:00:00.000Z',
  },
];

const SEED_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-01',
    userId: 'user-01',
    quotationNumber: 'QTN-2026-042',
    date: '2026-10-01',
    validUntil: '2026-10-31',
    status: 'sent',
    templateId: 'modern',
    seller: DEFAULT_BUSINESS_PROFILE,
    customerName: 'Zenith Global Healthcare Ltd',
    customerGstin: '29AABCZ9988H1Z1',
    customerPhone: '+91 99001 22334',
    customerEmail: 'procurement@zenithhealth.org',
    customerAddress: 'Outer Ring Road, Bellandur, Bengaluru',
    items: [
      {
        id: 'q-item-1',
        name: 'Patient Teleconsultation Portal & Mobile App',
        description: 'End-to-end video consultation, prescription & slot booking system',
        hsnSac: '998311',
        quantity: 1,
        unit: 'JOB (Job Work)',
        rate: 180000,
        discount: 10,
        discountType: 'percent',
        gstRate: 18,
        amount: 162000,
      },
      {
        id: 'q-item-2',
        name: 'SMS & WhatsApp Gateway Integration Pack',
        description: 'Automated appointment reminders & OTP setup',
        hsnSac: '998314',
        quantity: 1,
        unit: 'SET (Sets)',
        rate: 20000,
        discount: 0,
        discountType: 'percent',
        gstRate: 18,
        amount: 20000,
      },
    ],
    subtotal: 200000,
    discount: 18000,
    taxableAmount: 182000,
    cgst: 16380,
    sgst: 16380,
    igst: 0,
    grandTotal: 214760,
    notes: 'Quotation valid for 30 days from date of issue. 50% advance required upon project kickoff.',
    terms: '1. Standard warranty of 90 days after delivery.\n2. Cloud hosting charges billed separately as per actual AWS usage.',
    createdAt: '2026-10-01T12:00:00.000Z',
  },
];

const SEED_POS: PurchaseOrder[] = [
  {
    id: 'po-01',
    userId: 'user-01',
    poNumber: 'PO-2026-015',
    date: '2026-09-25',
    deliveryDate: '2026-10-10',
    paymentTerms: '30 Days Net',
    status: 'issued',
    templateId: 'modern',
    buyer: DEFAULT_BUSINESS_PROFILE,
    supplierName: 'Dell India Enterprise Hardware Ltd',
    supplierGstin: '29AABCB1234D1Z2',
    supplierPhone: '+91 80 4000 5000',
    supplierEmail: 'b2b.orders@dellindia.com',
    supplierAddress: 'Divyasree Greens, Inner Ring Road, Domlur, Bengaluru',
    shippingAddress: 'Apex Infotech Solutions, No. 42, Koramangala, Bengaluru 560034',
    items: [
      {
        id: 'po-item-1',
        product: 'Dell Latitude 5440 i7 16GB / 512GB SSD Laptops',
        sku: 'DELL-LAT-5440',
        quantity: 4,
        unit: 'NOS (Numbers)',
        unitPrice: 72000,
        gstRate: 18,
        total: 339840,
      },
    ],
    subtotal: 288000,
    tax: 51840,
    grandTotal: 339840,
    notes: 'Delivery must include manufacturer warranty cards and original GST tax invoice.',
    terms: 'Inspection will be performed within 48 hours of physical receipt at our premises.',
    createdAt: '2026-09-25T14:00:00.000Z',
  },
];

const SEED_RECEIPTS: Receipt[] = [
  {
    id: 'rec-01',
    userId: 'user-01',
    receiptNumber: 'REC-2026-058',
    date: '2026-09-30',
    customerName: 'Bharat Retail Tech Private Limited',
    amountReceived: 124785,
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-2026-089',
    paymentReference: 'NEFT/HDFC/TXN99882211',
    notes: 'Full payment received against invoice INV-2026-089.',
    receivedBy: 'Rajesh Sharma',
    seller: DEFAULT_BUSINESS_PROFILE,
    createdAt: '2026-09-30T15:00:00.000Z',
  },
];

const SEED_SALARY_SLIPS: SalarySlip[] = [
  {
    id: 'sal-01',
    userId: 'user-01',
    slipNumber: 'PAY-2026-09-001',
    month: 'September 2026',
    payDate: '2026-09-30',
    company: DEFAULT_BUSINESS_PROFILE,
    employeeName: 'Ananya Verma',
    employeeId: 'EMP-104',
    designation: 'Senior Frontend Engineer',
    department: 'Product Engineering',
    joiningDate: '2024-03-15',
    pan: 'BNQPV9876K',
    bankAccount: '91802004567890',
    bankName: 'ICICI Bank',
    ifsc: 'ICIC0000042',
    uanNumber: '100987654321',
    workingDays: 30,
    presentDays: 30,
    earnings: {
      basic: 45000,
      hra: 22500,
      conveyance: 3000,
      medical: 2500,
      specialAllowance: 12000,
      bonus: 5000,
      overtime: 0,
    },
    deductions: {
      pf: 5400,
      esi: 0,
      professionalTax: 200,
      tds: 4200,
      loanDeduction: 0,
      otherDeductions: 0,
    },
    grossSalary: 90000,
    totalDeductions: 9800,
    netSalary: 80200,
    netSalaryInWords: numberToWordsIndian(80200),
    createdAt: '2026-09-30T18:00:00.000Z',
  },
];

const SEED_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    userId: 'user-01',
    title: 'Office Space Rent (Koramangala 3rd Floor)',
    category: 'Rent',
    amount: 45000,
    date: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly commercial rental paid to landlord',
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    id: 'exp-2',
    userId: 'user-01',
    title: 'AWS Cloud & Production Server Hosting',
    category: 'Software',
    amount: 14200,
    date: '2026-10-02',
    paymentMethod: 'Credit Card',
    notes: 'EC2, RDS, and S3 backup billing',
    createdAt: '2026-10-02T10:30:00.000Z',
  },
  {
    id: 'exp-3',
    userId: 'user-01',
    title: 'Google Workspace & Business Email Suite',
    category: 'Software',
    amount: 4800,
    date: '2026-09-28',
    paymentMethod: 'UPI',
    notes: '10 user accounts annual renewal',
    createdAt: '2026-09-28T11:00:00.000Z',
  },
  {
    id: 'exp-4',
    userId: 'user-01',
    title: 'Airtel Fiber Gigabit High-Speed Internet',
    category: 'Internet',
    amount: 3540,
    date: '2026-09-25',
    paymentMethod: 'UPI',
    notes: 'Office primary and backup broadband connection',
    createdAt: '2026-09-25T14:00:00.000Z',
  },
  {
    id: 'exp-5',
    userId: 'user-01',
    title: 'BESCOM Electricity Bill for September',
    category: 'Electricity',
    amount: 6850,
    date: '2026-09-20',
    paymentMethod: 'UPI',
    notes: 'Office AC and server power consumption',
    createdAt: '2026-09-20T16:00:00.000Z',
  },
  {
    id: 'exp-6',
    userId: 'user-01',
    title: 'Client Meeting Travel & Fuel Reimbursement',
    category: 'Travel',
    amount: 2400,
    date: '2026-09-18',
    paymentMethod: 'Cash',
    notes: 'Cab fares for client demo in Whitefield',
    createdAt: '2026-09-18T18:00:00.000Z',
  },
];

const SEED_BUSINESS_CARDS: BusinessCardData[] = [
  {
    id: 'bc-01',
    userId: 'user-01',
    name: 'Rajesh Sharma',
    designation: 'Managing Director & Tech Consultant',
    businessName: 'Apex Infotech Solutions',
    tagline: 'Empowering Indian Businesses with Next-Gen Digital Tools',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'rajesh@apexinfotech.in',
    website: 'https://apexinfotech.in',
    address: 'Koramangala, Bengaluru, Karnataka 560034',
    theme: 'modern-blue',
    qrCodeType: 'upi',
    upiId: 'apexinfotech@hdfcbank',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rajesh-apex',
    },
    createdAt: '2026-09-15T10:00:00.000Z',
  },
];

const SEED_CATALOGUES: WhatsAppCatalogue[] = [
  {
    id: 'cat-01',
    userId: 'user-01',
    title: 'Apex Cloud & Software Solutions Catalogue 2026',
    description: 'Explore our popular digital transformation packages for Indian MSMEs.',
    whatsappNumber: '+919876543210',
    businessName: 'Apex Infotech Solutions',
    currency: '₹',
    products: [
      {
        id: 'p-1',
        name: 'GST Billing & Inventory POS Software',
        description: 'Complete offline & online billing with barcode support, thermal receipt printing and GST reports.',
        price: 9999,
        originalPrice: 14999,
        discountPercent: 33,
        sku: 'POS-GST-01',
        category: 'Software Solutions',
        imageUrl: '',
        inStock: true,
        whatsappOrderMessage: 'Hi Apex Infotech! I am interested in purchasing the GST Billing & Inventory POS Software (₹9,999). Please share more details and demo link.',
      },
      {
        id: 'p-2',
        name: 'Custom Business Website + Domain + Hosting (1 Year)',
        description: 'High converting, mobile-friendly 5-page business website with WhatsApp chat integration and SSL.',
        price: 14999,
        originalPrice: 22000,
        discountPercent: 31,
        sku: 'WEB-STARTER',
        category: 'Web Services',
        imageUrl: '',
        inStock: true,
        whatsappOrderMessage: 'Hi Apex Infotech! I would like to order the Custom Business Website Package (₹14,999). Let us discuss requirements.',
      },
      {
        id: 'p-3',
        name: 'WhatsApp Business API & Automated Chatbot Setup',
        description: 'Official WhatsApp Green Tick onboarding, interactive broadcast messages and automated order replies.',
        price: 7499,
        originalPrice: 11999,
        discountPercent: 37,
        sku: 'WA-BOT-PRO',
        category: 'Marketing Tools',
        imageUrl: '',
        inStock: true,
        whatsappOrderMessage: 'Hello! Please provide details for WhatsApp Business API setup (₹7,499).',
      },
    ],
    createdAt: '2026-09-20T10:00:00.000Z',
  },
];

const SEED_DELIVERY_CHALLANS: DeliveryChallan[] = [
  {
    id: 'dc-01',
    userId: 'user-01',
    challanNumber: 'DC-2026-024',
    challanDate: '2026-10-02',
    ewayBillNumber: '341098234512',
    vehicleNumber: 'KA-01-MJ-8822',
    transporterName: 'VRL Logistics Express Ltd',
    transportMode: 'Road Transport',
    reasonForTransportation: 'Job Work',
    status: 'issued',
    templateId: 'modern',
    consignor: DEFAULT_BUSINESS_PROFILE,
    consigneeName: 'Precision CNC Works & Tooling Ltd',
    consigneeGstin: '29AABCP1122E1Z5',
    consigneePhone: '+91 98450 77889',
    consigneeEmail: 'plant.incharge@precisioncnc.in',
    consigneeAddress: 'Plot 45, Peenya Industrial Area, Phase 2, Bengaluru',
    consigneeState: 'Karnataka',
    consigneeCity: 'Bengaluru',
    consigneePincode: '560058',
    placeOfSupply: 'Karnataka',
    items: [
      {
        id: 'dc-item-1',
        description: 'Raw Aluminium Alloy Extrusions (Grade 6061-T6) for CNC Machining',
        hsnSac: '760429',
        quantity: 150,
        unit: 'KGS (Kilograms)',
        taxableRate: 420,
        gstRate: 18,
        totalTax: 11340,
        totalValue: 74340,
      },
      {
        id: 'dc-item-2',
        description: 'Stainless Steel Fasteners & Mounting Brackets (SS 304)',
        hsnSac: '731815',
        quantity: 500,
        unit: 'PCS (Pieces)',
        taxableRate: 45,
        gstRate: 18,
        totalTax: 4050,
        totalValue: 26550,
      },
    ],
    subtotal: 85500,
    totalTax: 15390,
    grandTotal: 100890,
    amountInWords: numberToWordsIndian(100890),
    declaration:
      'Goods dispatched strictly for Job Work processing under Rule 55 of CGST Rules, 2017. To be returned after processing within 180 days.',
    terms:
      '1. Transporter copy to accompany the vehicle during transit.\n2. Quantity & physical integrity must be verified upon delivery at site.',
    notes: 'Contact dispatch manager at +91 98765 43210 for gate entry verification.',
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
];

// LocalStorage Helper wrapper for SSR safe storage
class StorageRepository {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser()) return fallback;
    try {
      const data = localStorage.getItem(`biztools_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(`biztools_${key}`, JSON.stringify(value));
      window.dispatchEvent(new Event('biztools_storage_updated'));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage`, e);
    }
  }

  // Initialize seed data if not present
  public init(): void {
    if (!this.isBrowser()) return;
    if (!localStorage.getItem('biztools_profile')) {
      this.setItem('profile', DEFAULT_BUSINESS_PROFILE);
    }
    if (!localStorage.getItem('biztools_invoices')) {
      this.setItem('invoices', SEED_INVOICES);
    }
    if (!localStorage.getItem('biztools_quotations')) {
      this.setItem('quotations', SEED_QUOTATIONS);
    }
    if (!localStorage.getItem('biztools_pos')) {
      this.setItem('pos', SEED_POS);
    }
    if (!localStorage.getItem('biztools_receipts')) {
      this.setItem('receipts', SEED_RECEIPTS);
    }
    if (!localStorage.getItem('biztools_salary_slips')) {
      this.setItem('salary_slips', SEED_SALARY_SLIPS);
    }
    if (!localStorage.getItem('biztools_expenses')) {
      this.setItem('expenses', SEED_EXPENSES);
    }
    if (!localStorage.getItem('biztools_business_cards')) {
      this.setItem('business_cards', SEED_BUSINESS_CARDS);
    }
    if (!localStorage.getItem('biztools_catalogues')) {
      this.setItem('catalogues', SEED_CATALOGUES);
    }
    if (!localStorage.getItem('biztools_delivery_challans')) {
      this.setItem('delivery_challans', SEED_DELIVERY_CHALLANS);
    }
  }

  // Business Profile
  public getProfile(): BusinessProfile {
    return this.getItem<BusinessProfile>('profile', DEFAULT_BUSINESS_PROFILE);
  }

  public saveProfile(profile: BusinessProfile): void {
    this.setItem('profile', profile);
  }

  // Invoices
  public getInvoices(): Invoice[] {
    return this.getItem<Invoice[]>('invoices', SEED_INVOICES);
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.getInvoices().find((inv) => inv.id === id);
  }

  public saveInvoice(invoice: Invoice): void {
    const list = this.getInvoices();
    const index = list.findIndex((inv) => inv.id === invoice.id);
    if (index >= 0) {
      list[index] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem('invoices', list);
  }

  public deleteInvoice(id: string): void {
    const list = this.getInvoices().filter((inv) => inv.id !== id);
    this.setItem('invoices', list);
  }

  // Quotations
  public getQuotations(): Quotation[] {
    return this.getItem<Quotation[]>('quotations', SEED_QUOTATIONS);
  }

  public saveQuotation(quotation: Quotation): void {
    const list = this.getQuotations();
    const index = list.findIndex((q) => q.id === quotation.id);
    if (index >= 0) {
      list[index] = quotation;
    } else {
      list.unshift(quotation);
    }
    this.setItem('quotations', list);
  }

  public deleteQuotation(id: string): void {
    const list = this.getQuotations().filter((q) => q.id !== id);
    this.setItem('quotations', list);
  }

  // Purchase Orders
  public getPurchaseOrders(): PurchaseOrder[] {
    return this.getItem<PurchaseOrder[]>('pos', SEED_POS);
  }

  public savePurchaseOrder(po: PurchaseOrder): void {
    const list = this.getPurchaseOrders();
    const index = list.findIndex((p) => p.id === po.id);
    if (index >= 0) {
      list[index] = po;
    } else {
      list.unshift(po);
    }
    this.setItem('pos', list);
  }

  public deletePurchaseOrder(id: string): void {
    const list = this.getPurchaseOrders().filter((p) => p.id !== id);
    this.setItem('pos', list);
  }

  // Receipts
  public getReceipts(): Receipt[] {
    return this.getItem<Receipt[]>('receipts', SEED_RECEIPTS);
  }

  public saveReceipt(receipt: Receipt): void {
    const list = this.getReceipts();
    const index = list.findIndex((r) => r.id === receipt.id);
    if (index >= 0) {
      list[index] = receipt;
    } else {
      list.unshift(receipt);
    }
    this.setItem('receipts', list);
  }

  public deleteReceipt(id: string): void {
    const list = this.getReceipts().filter((r) => r.id !== id);
    this.setItem('receipts', list);
  }

  // Salary Slips
  public getSalarySlips(): SalarySlip[] {
    return this.getItem<SalarySlip[]>('salary_slips', SEED_SALARY_SLIPS);
  }

  public saveSalarySlip(slip: SalarySlip): void {
    const list = this.getSalarySlips();
    const index = list.findIndex((s) => s.id === slip.id);
    if (index >= 0) {
      list[index] = slip;
    } else {
      list.unshift(slip);
    }
    this.setItem('salary_slips', list);
  }

  public deleteSalarySlip(id: string): void {
    const list = this.getSalarySlips().filter((s) => s.id !== id);
    this.setItem('salary_slips', list);
  }

  // Expenses
  public getExpenses(): Expense[] {
    return this.getItem<Expense[]>('expenses', SEED_EXPENSES);
  }

  public saveExpense(expense: Expense): void {
    const list = this.getExpenses();
    const index = list.findIndex((e) => e.id === expense.id);
    if (index >= 0) {
      list[index] = expense;
    } else {
      list.unshift(expense);
    }
    this.setItem('expenses', list);
  }

  public deleteExpense(id: string): void {
    const list = this.getExpenses().filter((e) => e.id !== id);
    this.setItem('expenses', list);
  }

  // Business Cards
  public getBusinessCards(): BusinessCardData[] {
    return this.getItem<BusinessCardData[]>('business_cards', SEED_BUSINESS_CARDS);
  }

  public saveBusinessCard(card: BusinessCardData): void {
    const list = this.getBusinessCards();
    const index = list.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      list[index] = card;
    } else {
      list.unshift(card);
    }
    this.setItem('business_cards', list);
  }

  // Catalogues
  public getCatalogues(): WhatsAppCatalogue[] {
    return this.getItem<WhatsAppCatalogue[]>('catalogues', SEED_CATALOGUES);
  }

  public saveCatalogue(cat: WhatsAppCatalogue): void {
    const list = this.getCatalogues();
    const index = list.findIndex((c) => c.id === cat.id);
    if (index >= 0) {
      list[index] = cat;
    } else {
      list.unshift(cat);
    }
    this.setItem('catalogues', list);
  }

  // Contact messages
  public getContactMessages(): ContactMessage[] {
    return this.getItem<ContactMessage[]>('contact_messages', [
      {
        id: 'msg-1',
        name: 'Vikas Agarwal',
        email: 'vikas@agarwalsons.in',
        phone: '+91 98310 99881',
        businessType: 'Retail FMCG Wholesale',
        message: 'Looking for custom multi-store barcode integration with BizTools India.',
        createdAt: '2026-10-01T11:20:00.000Z',
        status: 'unread',
      },
      {
        id: 'msg-2',
        name: 'Pooja Sundaram',
        email: 'pooja.design@freelance.in',
        phone: '+91 97400 55667',
        businessType: 'Freelance UI/UX Designer',
        message: 'Loving the GST quotation to invoice conversion tool! Is bulk PDF zip download planned?',
        createdAt: '2026-09-29T16:45:00.000Z',
        status: 'read',
      },
    ]);
  }

  public saveContactMessage(msg: ContactMessage): void {
    const list = this.getContactMessages();
    list.unshift(msg);
    this.setItem('contact_messages', list);
  }

  // Delivery Challans
  public getDeliveryChallans(): DeliveryChallan[] {
    return this.getItem<DeliveryChallan[]>('delivery_challans', SEED_DELIVERY_CHALLANS);
  }

  public saveDeliveryChallan(challan: DeliveryChallan): void {
    const list = this.getDeliveryChallans();
    const index = list.findIndex((c) => c.id === challan.id);
    if (index >= 0) {
      list[index] = challan;
    } else {
      list.unshift(challan);
    }
    this.setItem('delivery_challans', list);
  }

  public deleteDeliveryChallan(id: string): void {
    const list = this.getDeliveryChallans().filter((c) => c.id !== id);
    this.setItem('delivery_challans', list);
  }

  // Reset to full demo
  public resetToDemo(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('biztools_profile');
    localStorage.removeItem('biztools_invoices');
    localStorage.removeItem('biztools_quotations');
    localStorage.removeItem('biztools_pos');
    localStorage.removeItem('biztools_receipts');
    localStorage.removeItem('biztools_salary_slips');
    localStorage.removeItem('biztools_expenses');
    localStorage.removeItem('biztools_business_cards');
    localStorage.removeItem('biztools_catalogues');
    localStorage.removeItem('biztools_delivery_challans');
    this.init();
    window.dispatchEvent(new Event('biztools_storage_updated'));
  }
}

export const storage = new StorageRepository();
