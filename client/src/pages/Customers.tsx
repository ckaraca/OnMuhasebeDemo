import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { type Customer } from "@shared/schema";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setCustomerModalOpen, setEditingCustomer } = useAppStore();

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Başarılı",
        description: "Müşteri başarıyla silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Müşteri silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.taxId.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For demo purposes, we'll consider customers with positive balance as "active"
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && (customer.balance || 0) >= 0) ||
                         (statusFilter === "inactive" && (customer.balance || 0) < 0);
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatBalance = (balance: number) => {
    const isNegative = balance < 0;
    const formatted = `₺${Math.abs(balance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return { formatted: isNegative ? `-${formatted}` : formatted, isNegative };
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Müşteri Listesi</h3>
          <Button 
            onClick={() => setCustomerModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Müşteri
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Müşteri Adı</TableHead>
                <TableHead>Vergi/TC No</TableHead>
                <TableHead>Bakiye</TableHead>
                <TableHead>Son Fatura</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? "Arama kriterlerine uygun müşteri bulunamadı" : "Henüz müşteri eklenmemiş"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => {
                  const { formatted: balanceFormatted, isNegative } = formatBalance(customer.balance || 0);
                  
                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                            <span className="text-primary font-medium text-sm">
                              {getInitials(customer.name)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email || "-"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{customer.taxId}</TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                          {balanceFormatted}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(customer.lastInvoiceDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(customer.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Toplam {filteredCustomers.length} müşteri gösteriliyor
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Önceki
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
