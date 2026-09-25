import type { VehicleCategory } from "./vehicle.js";

// Shape of the Postgres schema created by schema.sql. Passing this to
// createClient makes every query result typed instead of `any`.
//
// These have to be type aliases rather than interfaces: supabase-js checks
// each row against Record<string, unknown>, and interfaces don't get the
// implicit index signature that makes that assignment work.

export type TourRow = {
  id: string;
  slug: string;
  name: string;
  duration: string;
  pickup_time: string;
  description: string;
  highlights: string[];
  included: string[];
  starting_price: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type VehicleSamplePricesJson = {
  colombo?: string;
  galle?: string;
  sigiriya?: string;
};

export type VehicleRow = {
  id: string;
  slug: string;
  name: string;
  category: VehicleCategory;
  seats: number;
  ac: boolean;
  luggage_capacity: string;
  description: string;
  image: string;
  sample_prices: VehicleSamplePricesJson;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EnquiryStatus = "new" | "contacted" | "confirmed" | "closed";

export type BookingEnquiryRow = {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  flight_number: string | null;
  arrival_date: string;
  arrival_time: string;
  pickup_location: string;
  drop_location: string;
  vehicle_type: string;
  message: string | null;
  status: EnquiryStatus;
  email_sent: boolean;
  source_ip: string | null;
  user_agent: string | null;
  created_at: string;
};

export type AppMetaRow = {
  key: string;
  value: string;
  updated_at: string;
};

// Columns with database defaults are optional on insert.
export type TourInsert = Omit<TourRow, "id" | "created_at" | "updated_at" | "sort_order"> & {
  sort_order?: number;
};

export type VehicleInsert = Omit<VehicleRow, "id" | "created_at" | "updated_at" | "sort_order"> & {
  sort_order?: number;
};

export type BookingEnquiryInsert = Omit<
  BookingEnquiryRow,
  "id" | "created_at" | "status" | "email_sent"
> & {
  status?: EnquiryStatus;
  email_sent?: boolean;
};

export type AppMetaInsert = Omit<AppMetaRow, "updated_at">;

export type Database = {
  public: {
    Tables: {
      tours: {
        Row: TourRow;
        Insert: TourInsert;
        Update: Partial<TourInsert>;
        Relationships: [];
      };
      vehicles: {
        Row: VehicleRow;
        Insert: VehicleInsert;
        Update: Partial<VehicleInsert>;
        Relationships: [];
      };
      booking_enquiries: {
        Row: BookingEnquiryRow;
        Insert: BookingEnquiryInsert;
        Update: Partial<BookingEnquiryInsert>;
        Relationships: [];
      };
      app_meta: {
        Row: AppMetaRow;
        Insert: AppMetaInsert;
        Update: Partial<AppMetaInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
