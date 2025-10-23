import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerAlert } from "@/hooks/useCustomerDetection";
import { User, CreditCard, Banknote, MessageSquare, Calendar, Phone, Mail } from "lucide-react";

interface CustomerDetectionAlertProps {
  alert: CustomerAlert;
}

const classificationConfig = {
  HNW: { color: "bg-success", label: "High Net Worth" },
  Irate: { color: "bg-destructive", label: "Irate Customer" },
  Aged: { color: "bg-warning", label: "Senior Citizen" },
  Standard: { color: "bg-primary", label: "Standard" },
};

export function CustomerDetectionAlert({ alert }: CustomerDetectionAlertProps) {
  const config = classificationConfig[alert.classification as keyof typeof classificationConfig] || classificationConfig.Standard;

  return (
    <Card className="border-l-4" style={{ borderLeftColor: `hsl(var(--${config.color.replace('bg-', '')}))` }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            {alert.customer.first_name} {alert.customer.last_name}
          </CardTitle>
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Detected at {new Date(alert.detection_time).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Customer ID</p>
            <p className="text-sm font-medium">{alert.customer_id}</p>
          </div>
          {alert.customer.email && (
            <div className="space-y-1 flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{alert.customer.email}</p>
              </div>
            </div>
          )}
          {alert.customer.phone_number && (
            <div className="space-y-1 flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{alert.customer.phone_number}</p>
              </div>
            </div>
          )}
          {alert.customer.age && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-medium">{alert.customer.age} years</p>
            </div>
          )}
        </div>

        {/* Profile Status */}
        <div className="flex gap-2">
          <Badge variant="secondary">
            Profile: {alert.customer.profile_status || "Unknown"}
          </Badge>
          <Badge variant="secondary">
            KYC: {alert.customer.kyc_status || "Unknown"}
          </Badge>
          {alert.customer.last_visit_date && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last Visit: {new Date(alert.customer.last_visit_date).toLocaleDateString()}
            </Badge>
          )}
        </div>

        {/* Account Info */}
        {alert.account && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="h-4 w-4" />
              <p className="font-semibold text-sm">Account Details</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">{alert.account.account_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium">{alert.account.account_status || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-medium">
                  ₹{alert.account.current_balance?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {alert.cards && alert.cards.length > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4" />
              <p className="font-semibold text-sm">Cards ({alert.cards.length})</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {alert.cards.map((card, idx) => (
                <Badge key={idx} variant="outline">
                  {card.card_type || "Card"} - {card.card_status || "Unknown"}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Loans */}
        {alert.loans && alert.loans.length > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="h-4 w-4" />
              <p className="font-semibold text-sm">Loans ({alert.loans.length})</p>
            </div>
            <div className="space-y-1">
              {alert.loans.map((loan, idx) => (
                <div key={idx} className="text-sm flex justify-between">
                  <span>{loan.loan_type || "Loan"}</span>
                  <span className="font-medium">
                    Outstanding: ₹{loan.outstanding_amount?.toLocaleString() || "0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Interaction */}
        {alert.latestInteraction && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4" />
              <p className="font-semibold text-sm">Latest Interaction</p>
            </div>
            <div className="text-sm">
              <p>
                <span className="font-medium">{alert.latestInteraction.interaction_type || "N/A"}</span>
                {alert.latestInteraction.channel && (
                  <span className="text-muted-foreground"> ({alert.latestInteraction.channel})</span>
                )}
              </p>
              {alert.latestInteraction.interaction_time && (
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.latestInteraction.interaction_time).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
