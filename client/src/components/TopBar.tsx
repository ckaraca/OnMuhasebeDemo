import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";

export default function TopBar() {
  const [location] = useLocation();
  const { setCustomerModalOpen, setInvoiceModalOpen } = useAppStore();

  const isCustomersPage = location === "/customers";
  const isInvoicesPage = location.startsWith("/invoices");

  function getPageTitle(): string {
    if (isCustomersPage) return "Cari (Customers)";
    if (isInvoicesPage) return "Faturalar (Invoices)";
    return "Dashboard";
  }

  const showAddButton = isCustomersPage || isInvoicesPage;

  function handleAddClick(): void {
    if (isCustomersPage) {
      setCustomerModalOpen(true);
    } else if (isInvoicesPage) {
      setInvoiceModalOpen(true);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-600 hover:text-gray-900">
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
      </div>

      {showAddButton && (
        <Button
          onClick={handleAddClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isCustomersPage ? "Yeni Müşteri" : "Yeni Fatura"}</span>
        </Button>
      )}
    </header>
  );
}
