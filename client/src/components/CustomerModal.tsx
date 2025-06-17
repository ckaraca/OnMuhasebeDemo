import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";

export default function CustomerModal() {
  const { 
    isCustomerModalOpen, 
    setCustomerModalOpen, 
    editingCustomer, 
    setEditingCustomer 
  } = useAppStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      name: "",
      taxId: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Set form values when editing customer changes
  React.useEffect(() => {
    if (editingCustomer) {
      form.reset({
        name: editingCustomer.name,
        taxId: editingCustomer.taxId,
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
        address: editingCustomer.address || "",
      });
    } else {
      form.reset({
        name: "",
        taxId: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editingCustomer, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const response = await apiRequest("POST", "/api/customers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Başarılı",
        description: "Müşteri başarıyla eklendi",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Müşteri eklenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const response = await apiRequest("PUT", `/api/customers/${editingCustomer!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Başarılı",
        description: "Müşteri başarıyla güncellendi",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Müşteri güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    if (editingCustomer) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    setCustomerModalOpen(false);
    setEditingCustomer(null);
    form.reset();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isCustomerModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCustomer ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Müşteri Adı / Unvan *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Şirket adı veya kişi adı" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vergi/TC No *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="10 veya 11 haneli numara" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="ornek@firma.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0532 123 45 67" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3}
                      placeholder="Tam adres bilgileri" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={handleClose}>
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
