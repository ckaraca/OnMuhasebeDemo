import { Customer, Invoice, InsertCustomer, InsertInvoice, type InsertInvoiceItem } from "@shared/schema";

function calculateInvoiceTotals(items: InsertInvoiceItem[]): {
  subtotal: number;
  totalVat: number;
  grandTotal: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalVat = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice * item.vatRate) / 100;
  }, 0);
  return { subtotal, totalVat, grandTotal: subtotal + totalVat };
}

export interface IStorage {
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private invoices: Map<string, Invoice>;
  private nextCustomerId = 1;
  private nextInvoiceId = 1;

  constructor() {
    this.customers = new Map();
    this.invoices = new Map();
    this.seedData();
  }

  private seedData() {
    const seedCustomers: Customer[] = [
      {
        id: "1",
        name: "ABC Teknoloji Ltd. Şti.",
        taxId: "1234567890",
        email: "info@abcteknoloji.com",
        phone: "0532 123 45 67",
        address: "Teknokent Mahallesi, İstanbul",
        balance: 12450,
        lastInvoiceDate: "2024-11-15",
      },
      {
        id: "2",
        name: "XYZ İnşaat A.Ş.",
        taxId: "9876543210",
        email: "contact@xyzinsaat.com",
        phone: "0541 987 65 43",
        address: "Merkez Mahallesi, Ankara",
        balance: -3250,
        lastInvoiceDate: "2024-11-08",
      },
    ];

    for (const customer of seedCustomers) {
      this.customers.set(customer.id, customer);
    }
    this.nextCustomerId = seedCustomers.length + 1;

    const seedInvoices: Invoice[] = [
      {
        id: "1",
        number: "ALI-2024-001",
        date: "2024-11-15",
        customerId: "1",
        customerName: "ABC Teknoloji Ltd. Şti.",
        type: "purchase",
        items: [
          {
            id: "1",
            description: "Laptop Bilgisayar",
            quantity: 5,
            unitPrice: 1700,
            vatRate: 18,
            total: 8500,
          }
        ],
        subtotal: 8500,
        totalVat: 1530,
        grandTotal: 10030,
        status: "draft",
      },
      {
        id: "2",
        number: "ALI-2024-002",
        date: "2024-11-14",
        customerId: "2",
        customerName: "XYZ İnşaat A.Ş.",
        type: "purchase",
        items: [
          {
            id: "1",
            description: "İnşaat Malzemesi",
            quantity: 10,
            unitPrice: 1575,
            vatRate: 18,
            total: 15750,
          }
        ],
        subtotal: 15750,
        totalVat: 2835,
        grandTotal: 18585,
        status: "paid",
      },
    ];

    for (const invoice of seedInvoices) {
      this.invoices.set(invoice.id, invoice);
    }
    this.nextInvoiceId = seedInvoices.length + 1;
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = (this.nextCustomerId++).toString();
    const customer: Customer = {
      ...insertCustomer,
      id,
      balance: 0,
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;

    const updatedCustomer = { ...customer, ...updates };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = (this.nextInvoiceId++).toString();
    const invoiceCount = Array.from(this.invoices.values()).filter(inv => inv.type === insertInvoice.type).length + 1;
    const prefix = insertInvoice.type === "purchase" ? "ALI" : "SAT";
    const number = `${prefix}-2024-${invoiceCount.toString().padStart(3, "0")}`;
    
    const { subtotal, totalVat, grandTotal } = calculateInvoiceTotals(insertInvoice.items);

    const itemsWithTotals = insertInvoice.items.map((item, index) => ({
      ...item,
      id: (index + 1).toString(),
      total: item.quantity * item.unitPrice,
    }));

    const invoice: Invoice = {
      ...insertInvoice,
      id,
      number,
      items: itemsWithTotals,
      subtotal,
      totalVat,
      grandTotal,
    };

    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;

    if (updates.items) {
      const itemsWithTotals = updates.items.map((item, index) => ({
        ...item,
        id: (index + 1).toString(),
        total: item.quantity * item.unitPrice,
      }));
      const totals = calculateInvoiceTotals(updates.items);
      const updatedInvoice: Invoice = {
        ...invoice,
        ...updates,
        items: itemsWithTotals,
        subtotal: totals.subtotal,
        totalVat: totals.totalVat,
        grandTotal: totals.grandTotal,
      };
      this.invoices.set(id, updatedInvoice);
      return updatedInvoice;
    }

    const updatedInvoice: Invoice = { ...invoice, ...updates, items: invoice.items };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    return this.invoices.delete(id);
  }
}

export const storage = new MemStorage();
