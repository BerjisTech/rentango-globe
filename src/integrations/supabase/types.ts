export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_type: string
          created_at: string
          end_date: string
          id: string
          item_name: string
          payment_status: string
          property_id: string | null
          start_date: string
          total_amount: number
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          booking_type: string
          created_at?: string
          end_date: string
          id?: string
          item_name: string
          payment_status: string
          property_id?: string | null
          start_date: string
          total_amount: number
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          booking_type?: string
          created_at?: string
          end_date?: string
          id?: string
          item_name?: string
          payment_status?: string
          property_id?: string | null
          start_date?: string
          total_amount?: number
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          booking_fee_percentage: number | null
          contact_email: string | null
          created_at: string
          enable_instant_booking: boolean | null
          id: string
          maintenance_mode: boolean | null
          site_description: string | null
          site_name: string
          support_phone: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          booking_fee_percentage?: number | null
          contact_email?: string | null
          created_at?: string
          enable_instant_booking?: boolean | null
          id?: string
          maintenance_mode?: boolean | null
          site_description?: string | null
          site_name: string
          support_phone?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          booking_fee_percentage?: number | null
          contact_email?: string | null
          created_at?: string
          enable_instant_booking?: boolean | null
          id?: string
          maintenance_mode?: boolean | null
          site_description?: string | null
          site_name?: string
          support_phone?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          accessibility_features: string[] | null
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          created_at: string
          distance_to_hospital: number | null
          distance_to_school: number | null
          ensuite_bathrooms: number | null
          has_electricity: boolean | null
          has_internet: boolean | null
          has_pool: boolean | null
          has_water: boolean | null
          id: string
          images: string[] | null
          kitchen_type: string | null
          location: string
          name: string
          parking_spaces: number | null
          price: number
          price_unit: string | null
          status: string | null
          type: string
        }
        Insert: {
          accessibility_features?: string[] | null
          amenities?: string[] | null
          bathrooms: number
          bedrooms: number
          created_at?: string
          distance_to_hospital?: number | null
          distance_to_school?: number | null
          ensuite_bathrooms?: number | null
          has_electricity?: boolean | null
          has_internet?: boolean | null
          has_pool?: boolean | null
          has_water?: boolean | null
          id?: string
          images?: string[] | null
          kitchen_type?: string | null
          location: string
          name: string
          parking_spaces?: number | null
          price: number
          price_unit?: string | null
          status?: string | null
          type: string
        }
        Update: {
          accessibility_features?: string[] | null
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          created_at?: string
          distance_to_hospital?: number | null
          distance_to_school?: number | null
          ensuite_bathrooms?: number | null
          has_electricity?: boolean | null
          has_internet?: boolean | null
          has_pool?: boolean | null
          has_water?: boolean | null
          id?: string
          images?: string[] | null
          kitchen_type?: string | null
          location?: string
          name?: string
          parking_spaces?: number | null
          price?: number
          price_unit?: string | null
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          position: string | null
          staff_type: Database["public"]["Enums"]["staff_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          position?: string | null
          staff_type: Database["public"]["Enums"]["staff_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          position?: string | null
          staff_type?: Database["public"]["Enums"]["staff_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string
          fuel_type: string
          id: string
          model: string
          name: string
          price_per_day: number
          seats: number
          transmission: string
          year: number
        }
        Insert: {
          created_at?: string
          fuel_type: string
          id?: string
          model: string
          name: string
          price_per_day: number
          seats: number
          transmission: string
          year: number
        }
        Update: {
          created_at?: string
          fuel_type?: string
          id?: string
          model?: string
          name?: string
          price_per_day?: number
          seats?: number
          transmission?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      staff_type:
        | "real_estate_agent"
        | "driver"
        | "manager"
        | "finance"
        | "customer_service"
        | "maintenance"
      user_role: "user" | "staff" | "owner" | "admin" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      staff_type: [
        "real_estate_agent",
        "driver",
        "manager",
        "finance",
        "customer_service",
        "maintenance",
      ],
      user_role: ["user", "staff", "owner", "admin", "superadmin"],
    },
  },
} as const
