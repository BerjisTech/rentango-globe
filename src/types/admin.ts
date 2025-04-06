// Common types for admin dashboard
export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  price_unit: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  created_at: string;
  images?: string[];
  kitchen_type?: string;
  ensuite_bathrooms?: number;
  accessibility_features?: string[];
  has_water?: boolean;
  has_electricity?: boolean;
  has_internet?: boolean;
  has_pool?: boolean;
  parking_spaces?: number;
  distance_to_school?: number;
  distance_to_hospital?: number;
  amenities?: string[];
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

export interface PlatformSettings {
  id: string;
  site_name: string;
  site_description: string | null;
  contact_email: string | null;
  support_phone: string | null;
  booking_fee_percentage: number | null;
  enable_instant_booking: boolean | null;
  maintenance_mode: boolean | null;
  version: string | null;
  created_at: string;
  updated_at: string;
}

// We'll keep this interface for the form fields that may not
// directly match our database structure
export interface Settings {
  id: string;
  site_name: string;
  site_description: string | null;
  contact_email: string | null;
  support_phone: string | null;
  allow_signups: boolean;
  require_email_verification: boolean;
  failed_login_attempts: number;
  password_expiry_days: number;
  booking_fee_percentage: number | null;
  enable_instant_booking: boolean | null;
  maintenance_mode: boolean | null;
  version: string | null;
  created_at: string;
  updated_at: string;
}
