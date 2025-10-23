export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      detection_events: {
        Row: {
          id: string
          customer_id: string
          detection_time: string
          branch_id?: string
          camera_id?: string
          confidence_score?: number
          metadata?: Json
        }
        Insert: {
          id?: string
          customer_id: string
          detection_time?: string
          branch_id?: string
          camera_id?: string
          confidence_score?: number
          metadata?: Json
        }
        Update: {
          id?: string
          customer_id?: string
          detection_time?: string
          branch_id?: string
          camera_id?: string
          confidence_score?: number
          metadata?: Json
        }
      }
      customers: {
        Row: {
          customer_id: string
          first_name: string
          last_name: string
          email?: string
          phone_number?: string
          date_of_birth?: string
          profile_status?: string
          kyc_status?: string
          last_visit_date?: string
          salary_slab?: string
          age?: number
          metadata?: Json
        }
      }
      accounts: {
        Row: {
          account_id: string
          customer_id: string
          account_type?: string
          account_status?: string
          current_balance?: number
          created_at?: string
        }
      }
      cards: {
        Row: {
          card_id: string
          customer_id: string
          card_type?: string
          card_status?: string
          card_number?: string
          expiry_date?: string
        }
      }
      loans: {
        Row: {
          loan_id: string
          customer_id: string
          loan_type?: string
          loan_amount?: number
          outstanding_amount?: number
          loan_status?: string
          start_date?: string
        }
      }
      interactions: {
        Row: {
          interaction_id: string
          customer_id: string
          interaction_type?: string
          interaction_time?: string
          channel?: string
          notes?: string
        }
      }
    }
  }
}
