import { useEffect, useState } from "react";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomerAlert {
  id: string;
  customer_id: string;
  detection_time: string;
  customer: {
    first_name: string;
    last_name: string;
    email?: string;
    phone_number?: string;
    profile_status?: string;
    kyc_status?: string;
    last_visit_date?: string;
    salary_slab?: string;
    age?: number;
  };
  account?: {
    account_type?: string;
    account_status?: string;
    current_balance?: number;
  };
  cards?: Array<{
    card_type?: string;
    card_status?: string;
  }>;
  loans?: Array<{
    loan_type?: string;
    outstanding_amount?: number;
  }>;
  latestInteraction?: {
    interaction_type?: string;
    interaction_time?: string;
    channel?: string;
  };
  classification: string;
}

export function useCustomerDetection() {
  const [alerts, setAlerts] = useState<CustomerAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomerDetails = async (customerId: string, detectionId: string, detectionTime: string) => {
    try {
      // Fetch customer info
      const { data: customer } = await externalSupabase
        .from("customers")
        .select("*")
        .eq("customer_id", customerId)
        .single() as { data: any };

      if (!customer) return null;

      // Fetch account info
      const { data: accounts } = await externalSupabase
        .from("accounts")
        .select("*")
        .eq("customer_id", customerId)
        .limit(1) as { data: any[] };

      // Fetch cards
      const { data: cards } = await externalSupabase
        .from("cards")
        .select("*")
        .eq("customer_id", customerId) as { data: any[] };

      // Fetch loans
      const { data: loans } = await externalSupabase
        .from("loans")
        .select("*")
        .eq("customer_id", customerId) as { data: any[] };

      // Fetch latest interaction
      const { data: interactions } = await externalSupabase
        .from("interactions")
        .select("*")
        .eq("customer_id", customerId)
        .order("interaction_time", { ascending: false })
        .limit(1) as { data: any[] };

      // Determine classification
      let classification = "Standard";
      const salarySlabNum = customer.salary_slab ? parseInt(customer.salary_slab as string) : 0;
      if (salarySlabNum > 1000000) {
        classification = "HNW";
      } else if (customer.age && customer.age >= 60) {
        classification = "Aged";
      }
      // You can add logic for "Irate" based on metadata or interaction history

      const alert: CustomerAlert = {
        id: detectionId,
        customer_id: customerId,
        detection_time: detectionTime,
        customer: {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          phone_number: customer.phone_number,
          profile_status: customer.profile_status,
          kyc_status: customer.kyc_status,
          last_visit_date: customer.last_visit_date,
          salary_slab: customer.salary_slab,
          age: customer.age,
        },
        account: accounts?.[0],
        cards: cards || [],
        loans: loans || [],
        latestInteraction: interactions?.[0],
        classification,
      };

      return alert;
    } catch (error) {
      console.error("Error fetching customer details:", error);
      return null;
    }
  };

  const loadRecentDetections = async () => {
    try {
      setLoading(true);
      const { data: detections, error } = await externalSupabase
        .from("detection_events")
        .select("*")
        .order("detection_time", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (detections) {
        const alertPromises = detections.map((detection: any) =>
          fetchCustomerDetails(detection.customer_id, detection.id, detection.detection_time)
        );
        const fetchedAlerts = await Promise.all(alertPromises);
        setAlerts(fetchedAlerts.filter((alert): alert is CustomerAlert => alert !== null));
      }
    } catch (error) {
      console.error("Error loading detections:", error);
      toast({
        title: "Error",
        description: "Failed to load detection events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentDetections();

    // Subscribe to real-time detection events
    const channel = externalSupabase
      .channel("detection_events_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "detection_events",
        },
        async (payload) => {
          console.log("New detection event:", payload);
          
          const newDetection = payload.new as any;
          const alert = await fetchCustomerDetails(
            newDetection.customer_id,
            newDetection.id,
            newDetection.detection_time
          );

          if (alert) {
            setAlerts((prev) => [alert, ...prev]);
            
            toast({
              title: "🚨 Customer Detected",
              description: `${alert.customer.first_name} ${alert.customer.last_name} (${alert.classification})`,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      externalSupabase.removeChannel(channel);
    };
  }, [toast]);

  return { alerts, loading, refetch: loadRecentDetections };
}
