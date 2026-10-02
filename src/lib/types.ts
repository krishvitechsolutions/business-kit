export type DocumentType =
  | 'invoice'
  | 'quotation'
  | 'purchase_order'
  | 'receipt'
  | 'salary_slip'
  | 'business_card'
  | 'delivery_challan'
  | 'catalogue';

export type DocumentStatus = 'draft' | 'sent' | 'paid' | 'unpaid' | 'overdue' | 'accepted' | 'declined';

export type UserPlan = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  plan: UserPlan;
  createdAt: string;
  businessId?: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  ownerName: string;
  businessLogo?: string;
  tagline?: string;
  gstin?: string;
  pan?: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  accountHolderName?: string;
  upiId?: string;
  upiQrEnabled?: boolean;
  termsAndConditions?: string;
  notes?: string;
}

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number; // percentage or fixed
  discountType?: 'percent' | 'fixed';
  gstRate: number; // 0, 5, 12, 18, 28
  amount: number;
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'indigo' | 'bordered';

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: DocumentStatus;
  templateId: TemplateId;
  
  // Seller (from Business Profile or custom)
  seller: BusinessProfile;

  // Customer
  customerName: string;
  customerGstin?: string;
  customerPan?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerState: string;
  customerCity?: string;
  customerPincode?: string;

  placeOfSupply: string;
  isInterState: boolean;
  isReverseCharge: boolean;
  paymentTerms: string;

  items: LineItem[];

  // Totals
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  utgst?: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;

  amountInWords: string;
  notes: string;
  terms: string;
  
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    holderName: string;
    upiId: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  userId: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  templateId: TemplateId;
  seller: BusinessProfile;
  customerName: string;
  customerGstin?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: LineItem[];
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  notes: string;
  terms: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  userId: string;
  poNumber: string;
  date: string;
  deliveryDate: string;
  paymentTerms: string;
  status: 'draft' | 'issued' | 'received' | 'cancelled';
  templateId: TemplateId;
  buyer: BusinessProfile;
  supplierName: string;
  supplierGstin?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierAddress: string;
  shippingAddress?: string;
  items: {
    id: string;
    product: string;
    sku?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    gstRate: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  notes: string;
  terms: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  userId: string;
  receiptNumber: string;
  date: string;
  customerName: string;
  amountReceived: number;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit/Debit Card' | 'Cheque' | 'Other';
  invoiceNumber?: string;
  paymentReference?: string;
  notes?: string;
  receivedBy: string;
  seller: BusinessProfile;
  createdAt: string;
}

export interface SalarySlip {
  id: string;
  userId: string;
  slipNumber: string;
  month: string; // e.g., "October 2026"
  payDate: string;
  company: BusinessProfile;

  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  pan: string;
  bankAccount: string;
  bankName: string;
  ifsc: string;
  uanNumber?: string;
  workingDays: number;
  presentDays: number;

  earnings: {
    basic: number;
    hra: number;
    conveyance: number;
    medical: number;
    specialAllowance: number;
    bonus: number;
    overtime: number;
  };

  deductions: {
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    loanDeduction: number;
    otherDeductions: number;
  };

  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryInWords: string;
  createdAt: string;
}

export interface BusinessCardData {
  id: string;
  userId: string;
  name: string;
  designation: string;
  businessName: string;
  tagline?: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  theme: 'modern-blue' | 'dark-gold' | 'creative-gradient' | 'minimal-clean' | 'corporate-navy';
  logoUrl?: string;
  qrCodeType: 'upi' | 'vcard' | 'website' | 'whatsapp';
  upiId?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: string;
}

export interface CatalogueProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  sku?: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  whatsappOrderMessage?: string;
}

export interface WhatsAppCatalogue {
  id: string;
  userId: string;
  title: string;
  description: string;
  whatsappNumber: string;
  businessName: string;
  currency: string;
  products: CatalogueProduct[];
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  category:
    | 'Rent'
    | 'Salary'
    | 'Marketing'
    | 'Electricity'
    | 'Internet'
    | 'Travel'
    | 'Inventory'
    | 'Office'
    | 'Software'
    | 'Raw Materials'
    | 'Other';
  amount: number;
  date: string;
  paymentMethod: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export type TransportationReason =
  | 'Supply on Approval'
  | 'Job Work'
  | 'Exhibition or Trade Fair'
  | 'Internal Transfer / For Own Use'
  | 'Line Sale / Consignment'
  | 'Others';

export interface DeliveryChallanItem {
  id: string;
  description: string;
  hsnSac?: string;
  quantity: number;
  unit: string;
  taxableRate: number;
  gstRate: number;
  totalTax: number;
  totalValue: number;
}

export interface DeliveryChallan {
  id: string;
  userId: string;
  challanNumber: string;
  challanDate: string;
  ewayBillNumber?: string;
  vehicleNumber?: string;
  transporterName?: string;
  transportMode?: string;
  reasonForTransportation: TransportationReason;
  status: 'draft' | 'issued' | 'delivered' | 'cancelled';
  templateId: TemplateId;

  // Consignor (Sender)
  consignor: BusinessProfile;

  // Consignee (Recipient)
  consigneeName: string;
  consigneeGstin?: string;
  consigneePhone?: string;
  consigneeEmail?: string;
  consigneeAddress: string;
  consigneeState: string;
  consigneeCity?: string;
  consigneePincode?: string;
  placeOfSupply: string;

  items: DeliveryChallanItem[];

  subtotal: number;
  totalTax: number;
  grandTotal: number;
  amountInWords: string;

  declaration?: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

