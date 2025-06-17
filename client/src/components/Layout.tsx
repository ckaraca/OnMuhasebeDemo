import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import CustomerModal from "./CustomerModal";
import InvoiceWizard from "./InvoiceWizard";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      
      <CustomerModal />
      <InvoiceWizard />
    </div>
  );
}
