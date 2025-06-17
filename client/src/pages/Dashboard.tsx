import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { type Customer, type Invoice } from "@shared/schema";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  // Calculate KPIs
  const totalCustomers = customers.length;
  const totalInvoices = invoices.length;
  const outstandingBalance = customers.reduce((sum, customer) => sum + (customer.balance || 0), 0);
  const todaysSales = invoices
    .filter(invoice => {
      const today = new Date().toISOString().split('T')[0];
      return invoice.date === today && invoice.type === 'sales' && invoice.status === 'paid';
    })
    .reduce((sum, invoice) => sum + invoice.grandTotal, 0);

  // Mock data for chart (last 6 months)
  const chartData = {
    labels: ['Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas'],
    datasets: [{
      label: 'Satış (₺)',
      data: [65000, 78000, 55000, 89000, 67000, 92000],
      borderColor: 'hsl(207, 90%, 54%)',
      backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₺' + value.toLocaleString();
          }
        }
      }
    }
  };

  const kpiCards = [
    {
      title: "Toplam Müşteri",
      value: totalCustomers,
      change: "+12%",
      changeText: "son aydan",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      changeColor: "text-green-600"
    },
    {
      title: "Toplam Fatura",
      value: totalInvoices,
      change: "+8%",
      changeText: "son aydan",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      changeColor: "text-green-600"
    },
    {
      title: "Bekleyen Bakiye",
      value: `₺${Math.abs(outstandingBalance).toLocaleString('tr-TR')}`,
      change: "-5%",
      changeText: "son aydan",
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      changeColor: "text-red-600"
    },
    {
      title: "Bugünkü Satış",
      value: `₺${todaysSales.toLocaleString('tr-TR')}`,
      change: "+24%",
      changeText: "dünden",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
      changeColor: "text-green-600"
    }
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${kpi.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={`font-medium ${kpi.changeColor}`}>{kpi.change}</span>
                  <span className="text-gray-500 ml-1">{kpi.changeText}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Aylık Satış Trendi</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Son 6 Ay</option>
              <option>Son 12 Ay</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
