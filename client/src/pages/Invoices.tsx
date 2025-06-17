import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, ArrowDown, ArrowUp, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { type Invoice } from "@shared/schema";

export default function Invoices() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(() => {
    if (location.includes('/purchase')) return 'purchase';
    if (location.includes('/sales')) return 'sales';
    return 'purchase';
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setInvoiceModalOpen } = useAppStore();

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Başarılı",
        description: "Fatura başarıyla silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: error.message || "Fatura silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Filter invoices based on tab, search term, and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesType = invoice.type === activeTab;
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesType && matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Bu faturayı silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ödendi</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Taslak</Badge>;
  };

  const renderInvoiceTable = (type: 'purchase' | 'sales') => {
    const typeInvoices = filteredInvoices.filter(inv => inv.type === type);
    
    if (typeInvoices.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">
            {type === 'purchase' ? 'Henüz alış faturası bulunmuyor' : 'Henüz satış faturası bulunmuyor'}
          </p>
          <p className="text-sm">
            {type === 'purchase' ? 'İlk alış faturanızı oluşturun' : 'İlk satış faturanızı oluşturun'}
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Fatura No</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Net Tutar</TableHead>
              <TableHead>KDV</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typeInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell className="text-gray-500">{formatDate(invoice.date)}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{formatCurrency(invoice.subtotal)}</TableCell>
                <TableCell>{formatCurrency(invoice.totalVat)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(invoice.grandTotal)}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(invoice.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="purchase" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <ArrowDown className="w-4 h-4 mr-2" />
                Alış Faturaları
              </TabsTrigger>
              <TabsTrigger 
                value="sales"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Satış Faturaları
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="purchase" className="m-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Alış Faturaları</h3>
                <Button 
                  onClick={() => setInvoiceModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Fatura
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Fatura ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="paid">Ödendi</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" className="w-full sm:w-48" />
              </div>

              {renderInvoiceTable('purchase')}
            </div>
          </TabsContent>

          <TabsContent value="sales" className="m-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Satış Faturaları</h3>
                <Button 
                  onClick={() => setInvoiceModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Fatura
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Fatura ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="paid">Ödendi</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" className="w-full sm:w-48" />
              </div>

              {renderInvoiceTable('sales')}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
