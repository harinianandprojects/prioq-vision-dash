import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  customer_id: string;
  customer_name: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  hnw_status: string;
  age: number;
  emotion: string;
  timestamp: string;
  message: string;
  acknowledged: boolean;
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onSnooze: (id: string) => void;
  onFalsePositive: (id: string) => void;
}

const priorityConfig = {
  critical: { color: "bg-destructive", icon: AlertTriangle, label: "Critical" },
  high: { color: "bg-warning", icon: AlertTriangle, label: "High" },
  medium: { color: "bg-warning/60", icon: Clock, label: "Medium" },
  low: { color: "bg-primary", icon: Clock, label: "Low" },
};

const emotionEmoji = {
  calm: "😊",
  neutral: "😐",
  concerned: "😟",
  irate: "😠",
  anxious: "😰",
};

export function AlertCard({ alert, onAcknowledge, onSnooze, onFalsePositive }: AlertCardProps) {
  const config = priorityConfig[alert.priority];

  return (
    <div className={`bg-card border-l-4 ${config.color} rounded-lg p-4 shadow-card hover:shadow-elevated transition-all`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <config.icon className="h-5 w-5 text-card-foreground" />
            <h3 className="font-semibold text-card-foreground">{alert.customer_name}</h3>
            <Badge variant="secondary" className="text-xs">
              {alert.customer_id}
            </Badge>
            <Badge variant={alert.priority === "critical" ? "destructive" : "default"} className="text-xs">
              {config.label}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">HNW Status</span>
              <span className="text-sm font-medium text-card-foreground">{alert.hnw_status}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Age</span>
              <span className="text-sm font-medium text-card-foreground">{alert.age} years</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Emotion</span>
              <span className="text-sm font-medium text-card-foreground">
                {emotionEmoji[alert.emotion as keyof typeof emotionEmoji] || "😐"} {alert.emotion}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Category</span>
              <span className="text-sm font-medium text-card-foreground">{alert.category}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {new Date(alert.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!alert.acknowledged && (
            <>
              <Button
                size="sm"
                onClick={() => onAcknowledge(alert.id)}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Acknowledge
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSnooze(alert.id)}
              >
                <Clock className="h-4 w-4 mr-1" />
                Snooze
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onFalsePositive(alert.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                False
              </Button>
            </>
          )}
          {alert.acknowledged && (
            <Badge variant="outline" className="text-success border-success">
              ✓ Acknowledged
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
