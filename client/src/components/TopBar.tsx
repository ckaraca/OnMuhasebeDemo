import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";

export default function TopBar() {
  const [location] = useLocation();
  const { setCustomerModalOpen, setInvoiceModalOpen } = useAppStore();

  const getPageTitle = () => {
    if (location === "/" || location === "/dashboard") return "Dashboard";
    if (location === "/customers") return "Cari (Customers)";
    if (location === "/invoices" || location.startsWith("/invoices")) return "Faturalar (Invoices)";
    return "Dashboard";
  };

  const getAddButtonText = () => {
    if (location === "/customers") return "Yeni Müşteri";
    if (location === "/invoices" || location.startsWith("/invoices")) return "Yeni Fatura";
    return "Add New";
  };

  const showAddButton = () => {
    return location === "/customers" || location === "/invoices" || location.startsWith("/invoices");
  };

  const handleAddClick = () => {
    if (location === "/customers") {
      setCustomerModalOpen(true);
    } else if (location === "/invoices" || location.startsWith("/invoices")) {
      setInvoiceModalOpen(true);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-600 hover:text-gray-900">
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
      </div>

      {/* Action Button */}
      {showAddButton() && (
        <Button 
          onClick={handleAddClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{getAddButtonText()}</span>
        </Button>
      )}
    </header>
  );
}
