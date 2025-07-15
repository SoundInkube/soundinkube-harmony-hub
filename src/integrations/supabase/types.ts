export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      artists: {
        Row: {
          achievements: string[] | null
          availability_status: string | null
          created_at: string
          experience_years: number | null
          genres: string[] | null
          hourly_rate: number | null
          id: string
          instruments: string[] | null
          portfolio_urls: string[] | null
          profile_id: string
          rating: number | null
          stage_name: string
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          availability_status?: string | null
          created_at?: string
          experience_years?: number | null
          genres?: string[] | null
          hourly_rate?: number | null
          id?: string
          instruments?: string[] | null
          portfolio_urls?: string[] | null
          profile_id: string
          rating?: number | null
          stage_name: string
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          achievements?: string[] | null
          availability_status?: string | null
          created_at?: string
          experience_years?: number | null
          genres?: string[] | null
          hourly_rate?: number | null
          id?: string
          instruments?: string[] | null
          portfolio_urls?: string[] | null
          profile_id?: string
          rating?: number | null
          stage_name?: string
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_type: string
          client_id: string
          created_at: string
          description: string | null
          end_datetime: string
          id: string
          notes: string | null
          payment_status: string | null
          provider_id: string
          provider_type: string
          start_datetime: string
          status: string | null
          title: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_type: string
          client_id: string
          created_at?: string
          description?: string | null
          end_datetime: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          provider_id: string
          provider_type: string
          start_datetime: string
          status?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_type?: string
          client_id?: string
          created_at?: string
          description?: string | null
          end_datetime?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          provider_id?: string
          provider_type?: string
          start_datetime?: string
          status?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      music_schools: {
        Row: {
          address: string | null
          city: string | null
          courses_offered: string[] | null
          created_at: string
          description: string | null
          facilities: string[] | null
          founded_year: number | null
          id: string
          images: string[] | null
          instruments_taught: string[] | null
          monthly_fee: number | null
          postal_code: string | null
          profile_id: string
          rating: number | null
          school_name: string
          state: string | null
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          courses_offered?: string[] | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          founded_year?: number | null
          id?: string
          images?: string[] | null
          instruments_taught?: string[] | null
          monthly_fee?: number | null
          postal_code?: string | null
          profile_id: string
          rating?: number | null
          school_name: string
          state?: string | null
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          courses_offered?: string[] | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          founded_year?: number | null
          id?: string
          images?: string[] | null
          instruments_taught?: string[] | null
          monthly_fee?: number | null
          postal_code?: string | null
          profile_id?: string
          rating?: number | null
          school_name?: string
          state?: string | null
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_schools_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string
          user_type: string
          username: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          user_type?: string
          username?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
          username?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      record_labels: {
        Row: {
          address: string | null
          artists_signed: number | null
          city: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          genres: string[] | null
          id: string
          images: string[] | null
          label_name: string
          postal_code: string | null
          profile_id: string
          rating: number | null
          state: string | null
          total_reviews: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          artists_signed?: number | null
          city?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          genres?: string[] | null
          id?: string
          images?: string[] | null
          label_name: string
          postal_code?: string | null
          profile_id: string
          rating?: number | null
          state?: string | null
          total_reviews?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          artists_signed?: number | null
          city?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          genres?: string[] | null
          id?: string
          images?: string[] | null
          label_name?: string
          postal_code?: string | null
          profile_id?: string
          rating?: number | null
          state?: string | null
          total_reviews?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_labels_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          content: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      studios: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string | null
          created_at: string
          description: string | null
          equipment: string[] | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          postal_code: string | null
          profile_id: string
          rating: number | null
          specialties: string[] | null
          state: string | null
          studio_name: string
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          postal_code?: string | null
          profile_id: string
          rating?: number | null
          specialties?: string[] | null
          state?: string | null
          studio_name: string
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          postal_code?: string | null
          profile_id?: string
          rating?: number | null
          specialties?: string[] | null
          state?: string | null
          studio_name?: string
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "studios_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
