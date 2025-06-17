import { z } from "zod";

// Customer Schema
export const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Müşteri adı gerekli"),
  taxId: z.string().regex(/^[0-9]{10,11}$/, "Vergi/TC No 10 veya 11 haneli olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  balance: z.number().default(0),
  lastInvoiceDate: z.string().optional(),
});

export const insertCustomerSchema = customerSchema.omit({ id: true, balance: true, lastInvoiceDate: true });

export type Customer = z.infer<typeof customerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// Invoice Item Schema
export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Açıklama gerekli"),
  quantity: z.number().min(1, "Miktar en az 1 olmalı"),
  unitPrice: z.number().min(0, "Birim fiyat negatif olamaz"),
  vatRate: z.number().min(0).max(100),
  total: z.number(),
});

export const insertInvoiceItemSchema = invoiceItemSchema.omit({ id: true, total: true });

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;

// Invoice Schema
export const invoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  date: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  type: z.enum(["purchase", "sales"]),
  items: z.array(invoiceItemSchema),
  subtotal: z.number(),
  totalVat: z.number(),
  grandTotal: z.number(),
  status: z.enum(["draft", "paid"]),
});

export const insertInvoiceSchema = invoiceSchema.omit({ 
  id: true, 
  number: true, 
  subtotal: true, 
  totalVat: true, 
  grandTotal: true 
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
