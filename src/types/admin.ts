
// Common types for admin dashboard
export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  price_per_day: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  property_id: string | null;
  vehicle_id: string | null;
  item_name: string;
  booking_type: 'property' | 'vehicle';
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export interface Settings {
  id: string;
  site_name: string;
  site_description: string | null;
  contact_email: string | null;
  support_phone: string | null;
  allow_signups?: boolean;
  require_email_verification?: boolean;
  failed_login_attempts?: number;
  password_expiry_days?: number;
  booking_fee_percentage?: number | null;
  enable_instant_booking?: boolean | null;
  maintenance_mode?: boolean | null;
  version?: string | null;
  created_at: string;
  updated_at: string;
}
