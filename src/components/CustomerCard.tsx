import { User, Phone, Mail, CreditCard, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_status: string;
  kyc_status: string;
  hnw_status?: string;
  age?: number;
  recent_emotion?: string;
  rm_assigned?: string;
  loans?: string[];
  cards?: string[];
  tickets?: number;
  last_interactions?: string[];
}

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: (id: string) => void;
}

const statusColors = {
  active: "bg-success",
  inactive: "bg-muted",
  pending: "bg-warning",
  verified: "bg-success",
  expired: "bg-destructive",
};

export function CustomerCard({ customer, onViewDetails }: CustomerCardProps) {
  return (
    <div className="bg-card rounded-lg p-5 shadow-card hover:shadow-elevated transition-all border border-border">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary-foreground">
            {customer.first_name[0]}{customer.last_name[0]}
          </span>
        </div>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-card-foreground truncate">
              {customer.first_name} {customer.last_name}
            </h3>
            <Badge 
              variant="secondary" 
              className="text-xs"
            >
              {customer.customer_id}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{customer.phone_number}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge 
              className={`${statusColors[customer.profile_status as keyof typeof statusColors] || "bg-muted"} text-white text-xs`}
            >
              {customer.profile_status}
            </Badge>
            <Badge 
              className={`${statusColors[customer.kyc_status as keyof typeof statusColors] || "bg-muted"} text-white text-xs`}
            >
              KYC: {customer.kyc_status}
            </Badge>
            {customer.hnw_status && (
              <Badge variant="outline" className="text-xs border-primary text-primary">
                {customer.hnw_status}
              </Badge>
            )}
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            {customer.age && (
              <div>
                <span className="text-muted-foreground">Age: </span>
                <span className="font-medium text-card-foreground">{customer.age}</span>
              </div>
            )}
            {customer.rm_assigned && (
              <div>
                <span className="text-muted-foreground">RM: </span>
                <span className="font-medium text-card-foreground">{customer.rm_assigned}</span>
              </div>
            )}
            {customer.loans && customer.loans.length > 0 && (
              <div className="flex items-center gap-1">
                <CreditCard className="h-3 w-3 text-muted-foreground" />
                <span className="text-card-foreground">{customer.loans.length} Loan(s)</span>
              </div>
            )}
            {customer.tickets !== undefined && customer.tickets > 0 && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-warning" />
                <span className="text-card-foreground">{customer.tickets} Ticket(s)</span>
              </div>
            )}
          </div>

          {/* Recent Interactions */}
          {customer.last_interactions && customer.last_interactions.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Last 3 Interactions:</p>
              <div className="space-y-1">
                {customer.last_interactions.slice(0, 3).map((interaction, idx) => (
                  <p key={idx} className="text-xs text-card-foreground truncate">
                    • {interaction}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails(customer.customer_id)}
            className="mt-2"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
