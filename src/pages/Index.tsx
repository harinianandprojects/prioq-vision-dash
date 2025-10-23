import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CustomerDetectionAlert } from "@/components/CustomerDetectionAlert";
import { useCustomerDetection } from "@/hooks/useCustomerDetection";
import { useToast } from "@/hooks/use-toast";
import { Bell, TrendingUp, Users, AlertTriangle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [activeView, setActiveView] = useState("alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const { alerts, loading } = useCustomerDetection();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    const query = searchQuery.toLowerCase();
    return (
      alert.customer_id.toLowerCase().includes(query) ||
      alert.customer.first_name.toLowerCase().includes(query) ||
      alert.customer.last_name.toLowerCase().includes(query) ||
      alert.customer.email?.toLowerCase().includes(query) ||
      alert.customer.phone_number?.includes(query)
    );
  });

  const stats = [
    { label: "Active Alerts", value: alerts.length, icon: AlertTriangle, color: "text-destructive" },
    { label: "HNW Detections", value: alerts.filter(a => a.classification === "HNW").length, icon: TrendingUp, color: "text-success" },
    { label: "Aged Detections", value: alerts.filter(a => a.classification === "Aged").length, icon: Users, color: "text-warning" },
    { label: "Total Detections", value: alerts.length, icon: Bell, color: "text-primary" },
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Real-Time Customer Detection</h2>
            <p className="text-muted-foreground">
              Live alerts when customers enter the branch - automatically classified by HNW status, age, and priority
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, ID, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-card rounded-lg p-12 text-center shadow-card">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-lg text-muted-foreground">Loading detection events...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.length === 0 && (
                <div className="bg-card rounded-lg p-12 text-center shadow-card">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    {searchQuery ? "No matching detection events" : "No detection events yet"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Detection events will appear here in real-time when customers enter the branch
                  </p>
                </div>
              )}
              {filteredAlerts.map(alert => (
                <CustomerDetectionAlert key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dashboard Overview */}
      {activeView === "dashboard" && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
            <p className="text-muted-foreground">
              Real-time snapshot of customer detection analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Detections */}
            <div className="bg-card rounded-lg p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Detections</h3>
              {loading ? (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {alert.customer.first_name} {alert.customer.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{alert.customer_id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.classification === "HNW" ? "bg-success text-success-foreground" : 
                        alert.classification === "Aged" ? "bg-warning text-warning-foreground" : 
                        "bg-primary text-primary-foreground"
                      }`}>
                        {alert.classification}
                      </span>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No detections yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Classification Breakdown */}
            <div className="bg-card rounded-lg p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Detection Classification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-success-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">High Net Worth</p>
                      <p className="text-sm text-muted-foreground">Priority customers</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{alerts.filter(a => a.classification === "HNW").length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-warning flex items-center justify-center">
                      <Users className="h-5 w-5 text-warning-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Aged Customers</p>
                      <p className="text-sm text-muted-foreground">Senior citizens (60+)</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{alerts.filter(a => a.classification === "Aged").length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
