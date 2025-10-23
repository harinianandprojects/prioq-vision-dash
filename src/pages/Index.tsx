import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AlertCard } from "@/components/AlertCard";
import { CustomerCard } from "@/components/CustomerCard";
import { mockAlerts, mockCustomers } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Bell, TrendingUp, Users, AlertTriangle } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState("alerts");
  const [alerts, setAlerts] = useState(mockAlerts);
  const { toast } = useToast();

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged.",
    });
  };

  const handleSnooze = (id: string) => {
    toast({
      title: "Alert Snoozed",
      description: "Alert will reappear in 30 minutes.",
    });
  };

  const handleFalsePositive = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Marked as False Positive",
      description: "Feedback sent to training pipeline. Alert removed.",
      variant: "destructive",
    });
  };

  const handleViewDetails = (customerId: string) => {
    toast({
      title: "Customer Details",
      description: `Opening profile for ${customerId}`,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const stats = [
    { label: "Active Alerts", value: alerts.filter(a => !a.acknowledged).length, icon: AlertTriangle, color: "text-destructive" },
    { label: "Total Customers", value: mockCustomers.length, icon: Users, color: "text-primary" },
    { label: "HNW Clients", value: mockCustomers.filter(c => c.hnw_status === "High Net Worth").length, icon: TrendingUp, color: "text-success" },
    { label: "Pending Tickets", value: mockCustomers.reduce((sum, c) => sum + (c.tickets || 0), 0), icon: Bell, color: "text-warning" },
  ];

  return (
    <DashboardLayout
      activeView={activeView}
      onViewChange={setActiveView}
      onLogout={handleLogout}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card rounded-lg p-6 shadow-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
              </div>
              <stat.icon className={`h-10 w-10 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Alerts View */}
      {activeView === "alerts" && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Real-Time Alerts</h2>
            <p className="text-muted-foreground">
              Customer alerts based on HNW status, age, and emotional state detection
            </p>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 && (
              <div className="bg-card rounded-lg p-12 text-center shadow-card">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No active alerts</p>
              </div>
            )}
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
                onSnooze={handleSnooze}
                onFalsePositive={handleFalsePositive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Customers View */}
      {activeView === "customers" && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Customer Directory</h2>
            <p className="text-muted-foreground">
              Complete customer profiles with account details and interaction history
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockCustomers.map(customer => (
              <CustomerCard
                key={customer.customer_id}
                customer={customer}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Overview */}
      {activeView === "dashboard" && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
            <p className="text-muted-foreground">
              Complete snapshot of PrioQ operations and customer analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <div className="bg-card rounded-lg p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {alerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">{alert.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{alert.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.priority === "critical" ? "bg-destructive text-destructive-foreground" : 
                      alert.priority === "high" ? "bg-warning text-warning-foreground" : 
                      "bg-primary text-primary-foreground"
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* HNW Customers */}
            <div className="bg-card rounded-lg p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">High Net Worth Customers</h3>
              <div className="space-y-3">
                {mockCustomers
                  .filter(c => c.hnw_status === "High Net Worth")
                  .map(customer => (
                    <div key={customer.customer_id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">
                          {customer.first_name[0]}{customer.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {customer.first_name} {customer.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">RM: {customer.rm_assigned}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
