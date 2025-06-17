import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { insertInvoiceSchema, type InsertInvoice, type Customer } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";

const invoiceFormSchema = insertInvoiceSchema.extend({
  items: z.array(z.object({
    description: z.string().min(1, "Açıklama gerekli"),
    quantity: z.number().min(1, "Miktar en az 1 olmalı"),
    unitPrice: z.number().min(0, "Birim fiyat negatif olamaz"),
    vatRate: z.number().min(0).max(100),
  })).min(1, "En az bir kalem eklemelisiniz"),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function InvoiceWizard() {
  const [location] = useLocation();
  const { 
    isInvoiceModalOpen, 
    setInvoiceModalOpen,
    currentInvoiceStep,
    setCurrentInvoiceStep,
    resetInvoiceWizard
  } = useAppStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);

  // Determine invoice type from URL
  const invoiceType = location.includes('/purchase') ? 'purchase' : 'sales';

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      customerId: "",
      customerName: "",
      type: invoiceType,
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          vatRate: 18,
        }
      ],
      status: "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch customers for autocomplete
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.taxId.includes(customerSearch)
  );

  // Calculate totals
  const watchedItems = form.watch("items");
  const subtotal = watchedItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    return sum + itemTotal;
  }, 0);

  const totalVat = watchedItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
    const vatAmount = itemTotal * ((item.vatRate || 0) / 100);
    return sum + vatAmount;
  }, 0);

  const grandTotal = subtotal + totalVat;

  const createMutation = useMutation({
    mutationFn: async (data: InsertInvoice) => {
      const response = await apiRequest("POST", "/api/invoices", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Başarılı",
        description: "Fatura başarıyla oluşturuldu",
      });
      resetInvoiceWizard();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Fatura oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setShowCustomerSuggestions(false);
    form.setValue("customerId", customer.id);
    form.setValue("customerName", customer.name);
  };

  const addItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0,
      vatRate: 18,
    });
  };

  const nextStep = () => {
    if (currentInvoiceStep === 1) {
      // Validate customer selection
      if (!selectedCustomer) {
        toast({
          title: "Hata",
          description: "Lütfen bir müşteri seçin",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentInvoiceStep < 3) {
      setCurrentInvoiceStep(currentInvoiceStep + 1);
    }
  };

  const prevStep = () => {
    if (currentInvoiceStep > 1) {
      setCurrentInvoiceStep(currentInvoiceStep - 1);
    }
  };

  const onSubmit = (data: InvoiceFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    resetInvoiceWizard();
    setSelectedCustomer(null);
    setCustomerSearch("");
    form.reset();
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isInvoiceModalOpen) {
      form.setValue("type", invoiceType);
    }
  }, [isInvoiceModalOpen, invoiceType, form]);

  const getStepIndicatorClass = (step: number) => {
    if (step < currentInvoiceStep) return "w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium";
    if (step === currentInvoiceStep) return "w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium";
    return "w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium";
  };

  const getStepTextClass = (step: number) => {
    if (step <= currentInvoiceStep) return "ml-2 text-sm font-medium text-primary";
    return "ml-2 text-sm font-medium text-gray-500";
  };

  return (
    <Dialog open={isInvoiceModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-6xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Fatura Oluştur</DialogTitle>
          
          {/* Step Indicator */}
          <div className="mt-6">
            <div className="flex items-center">
              <div className="flex items-center text-primary">
                <div className={getStepIndicatorClass(1)}>1</div>
                <span className={getStepTextClass(1)}>Müşteri Seç</span>
              </div>
              <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                <div className={`h-full bg-primary transition-all duration-300 ${currentInvoiceStep >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={getStepIndicatorClass(2)}>2</div>
                <span className={getStepTextClass(2)}>Kalemler</span>
              </div>
              <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                <div className={`h-full bg-primary transition-all duration-300 ${currentInvoiceStep >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={getStepIndicatorClass(3)}>3</div>
                <span className={getStepTextClass(3)}>Önizleme</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Customer Selection */}
            {currentInvoiceStep === 1 && (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Seçin *</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerSuggestions(true);
                      }}
                      onFocus={() => setShowCustomerSuggestions(true)}
                      placeholder="Müşteri ara..."
                      className="w-full"
                    />
                    
                    {/* Customer Suggestions */}
                    {showCustomerSuggestions && customerSearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleCustomerSelect(customer)}
                            >
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">Vergi No: {customer.taxId}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-gray-500 text-sm">Müşteri bulunamadı</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fatura Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fatura No</label>
                    <Input
                      type="text"
                      placeholder="Otomatik oluşturulacak"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button type="button" onClick={nextStep} disabled={!selectedCustomer}>
                    Devam Et
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Invoice Items */}
            {currentInvoiceStep === 2 && (
              <div className="p-6 space-y-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Açıklama</TableHead>
                        <TableHead className="w-20 text-center">Miktar</TableHead>
                        <TableHead className="w-32 text-right">Birim Fiyat</TableHead>
                        <TableHead className="w-20 text-center">KDV%</TableHead>
                        <TableHead className="w-32 text-right">Tutar</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const quantity = form.watch(`items.${index}.quantity`) || 0;
                        const unitPrice = form.watch(`items.${index}.unitPrice`) || 0;
                        const itemTotal = quantity * unitPrice;
                        
                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Ürün/hizmet açıklaması"
                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        className="text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.unitPrice`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="text-right border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.vatRate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Select 
                                        value={field.value.toString()} 
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                      >
                                        <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">%0</SelectItem>
                                          <SelectItem value="1">%1</SelectItem>
                                          <SelectItem value="8">%8</SelectItem>
                                          <SelectItem value="18">%18</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₺{itemTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-center">
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
                  onClick={addItem}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Kalem Ekle
                </Button>
                
                {/* Totals */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="font-medium">₺{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV Toplam:</span>
                    <span className="font-medium">₺{totalVat.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                    <span>Genel Toplam:</span>
                    <span>₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Önizleme
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {currentInvoiceStep === 3 && (
              <div className="p-6">
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">FATURA</h2>
                    <p className="text-gray-600">Fatura No: Otomatik oluşturulacak</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold mb-2">Satıcı:</h3>
                      <div className="text-sm text-gray-600">
                        <p>Şirket Adı</p>
                        <p>Adres Bilgisi</p>
                        <p>Vergi No: 1234567890</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Alıcı:</h3>
                      {selectedCustomer && (
                        <div className="text-sm text-gray-600">
                          <p>{selectedCustomer.name}</p>
                          <p>{selectedCustomer.address}</p>
                          <p>Vergi No: {selectedCustomer.taxId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500 py-8">
                    <p>Tarih: {form.watch("date")}</p>
                    <p>Tip: {form.watch("type") === "purchase" ? "Alış Faturası" : "Satış Faturası"}</p>
                    <p>Kalem Sayısı: {watchedItems.length}</p>
                    <p className="font-semibold text-lg mt-4">
                      Toplam: ₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri
                  </Button>
                  <div className="space-x-3">
                    <Button 
                      type="submit" 
                      variant="outline" 
                      disabled={createMutation.isPending}
                      onClick={() => form.setValue("status", "draft")}
                    >
                      Taslak Kaydet
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      onClick={() => form.setValue("status", "paid")}
                    >
                      {createMutation.isPending ? "Kaydediliyor..." : "Faturayı Kaydet"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
