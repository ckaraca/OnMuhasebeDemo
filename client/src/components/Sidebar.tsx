import { Link, useLocation } from "wouter";
import { Calculator, ChartLine, Users, FileText, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function Sidebar() {
  const [location] = useLocation();
  const { setCurrentPage } = useAppStore();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: ChartLine,
      key: "dashboard"
    },
    {
      name: "Cari (Customers)",
      href: "/customers",
      icon: Users,
      key: "customers"
    },
    {
      name: "Faturalar (Invoices)",
      href: "/invoices",
      icon: FileText,
      key: "invoices",
      subItems: [
        {
          name: "Alış (Purchase)",
          href: "/invoices/purchase",
          icon: ArrowDown,
          key: "invoices-purchase"
        },
        {
          name: "Satış (Sales)",
          href: "/invoices/sales",
          icon: ArrowUp,
          key: "invoices-sales"
        }
      ]
    }
  ];

  const handleNavClick = (key: string) => {
    setCurrentPage(key);
  };

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:block">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-lg">Ön Muhasebe</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <div className="px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            
            return (
              <div key={item.key} className="mb-1">
                <Link href={item.href}>
                  <a 
                    className={cn(
                      "sidebar-nav-item",
                      isActive && "active"
                    )}
                    onClick={() => handleNavClick(item.key)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </a>
                </Link>
                
                {item.subItems && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = location === subItem.href;
                      
                      return (
                        <Link key={subItem.key} href={subItem.href}>
                          <a 
                            className={cn(
                              "block px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded",
                              isSubActive && "text-white bg-sidebar-accent"
                            )}
                            onClick={() => handleNavClick(subItem.key)}
                          >
                            <SubIcon className="w-4 h-4 mr-2 inline" />
                            {subItem.name}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
