export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      demo_requests: {
        Row: {
          challenge: string | null
          company: string | null
          country_code: string | null
          created_at: string | null
          email: string
          id: string
          interests: string[] | null
          message: string | null
          name: string
          phone: string | null
          status: string | null
          team_size: string | null
          updated_at: string | null
        }
        Insert: {
          challenge?: string | null
          company?: string | null
          country_code?: string | null
          created_at?: string | null
          email: string
          id?: string
          interests?: string[] | null
          message?: string | null
          name: string
          phone?: string | null
          status?: string | null
          team_size?: string | null
          updated_at?: string | null
        }
        Update: {
          challenge?: string | null
          company?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          message?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          team_size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      early_access_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          position: number | null
          reason_for_joining: string | null
          referral_code: string | null
          referral_count: number | null
          referred_by: string | null
          status: string | null
          team_size: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          position?: number | null
          reason_for_joining?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          status?: string | null
          team_size: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          position?: number | null
          reason_for_joining?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          status?: string | null
          team_size?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "early_access_requests_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "early_access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      easter_egg_discoveries: {
        Row: {
          country: string | null
          device_type: string | null
          discovered_at: string | null
          id: string
          source: string | null
          user_agent: string | null
        }
        Insert: {
          country?: string | null
          device_type?: string | null
          discovered_at?: string | null
          id?: string
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          country?: string | null
          device_type?: string | null
          discovered_at?: string | null
          id?: string
          source?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      feature_gates: {
        Row: {
          created_at: string
          description: string | null
          feature_key: string
          id: string
          min_plan_tier: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_key: string
          id?: string
          min_plan_tier?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_key?: string
          id?: string
          min_plan_tier?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          browser_info: Json | null
          category: string | null
          created_at: string
          id: string
          message: string
          page_url: string | null
          priority: string | null
          screenshot_url: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          browser_info?: Json | null
          category?: string | null
          created_at?: string
          id?: string
          message: string
          page_url?: string | null
          priority?: string | null
          screenshot_url?: string | null
          status?: string
          type?: string
          user_id: string
        }
        Update: {
          browser_info?: Json | null
          category?: string | null
          created_at?: string
          id?: string
          message?: string
          page_url?: string | null
          priority?: string | null
          screenshot_url?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          clicks_last_30_days: number
          created_at: string
          created_by: string
          destination_url: string
          domain: string | null
          expires_at: string | null
          geo_targets: Json | null
          id: string
          security_status: string
          short_url: string | null
          slug: string | null
          status: Database["public"]["Enums"]["link_status"]
          title: string | null
          total_clicks: number
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          workspace_id: string
        }
        Insert: {
          clicks_last_30_days?: number
          created_at?: string
          created_by: string
          destination_url: string
          domain?: string | null
          expires_at?: string | null
          geo_targets?: Json | null
          id?: string
          security_status?: string
          short_url?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["link_status"]
          title?: string | null
          total_clicks?: number
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id: string
        }
        Update: {
          clicks_last_30_days?: number
          created_at?: string
          created_by?: string
          destination_url?: string
          domain?: string | null
          expires_at?: string | null
          geo_targets?: Json | null
          id?: string
          security_status?: string
          short_url?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["link_status"]
          title?: string | null
          total_clicks?: number
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      public_short_links: {
        Row: {
          clicks: number
          created_at: string
          destination_url: string
          id: string
          slug: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          destination_url: string
          id?: string
          slug: string
        }
        Update: {
          clicks?: number
          created_at?: string
          destination_url?: string
          id?: string
          slug?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          corner_style: string | null
          created_at: string
          created_by: string
          frame_text: string | null
          has_logo: boolean
          id: string
          link_id: string
          name: string
          png_url: string | null
          primary_color: string | null
          secondary_color: string | null
          svg_url: string | null
          updated_at: string
          variant_name: string | null
          workspace_id: string | null
        }
        Insert: {
          corner_style?: string | null
          created_at?: string
          created_by: string
          frame_text?: string | null
          has_logo?: boolean
          id?: string
          link_id: string
          name: string
          png_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          svg_url?: string | null
          updated_at?: string
          variant_name?: string | null
          workspace_id?: string | null
        }
        Update: {
          corner_style?: string | null
          created_at?: string
          created_by?: string
          frame_text?: string | null
          has_logo?: boolean
          id?: string
          link_id?: string
          name?: string
          png_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          svg_url?: string | null
          updated_at?: string
          variant_name?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_items: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          status: string | null
          title: string
          votes: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title: string
          votes?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          votes?: number | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          priority: string | null
          status: string | null
          subject: string
        }
        Insert: {
          category: string
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          priority?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          category?: string
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          priority?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      utm_templates: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "utm_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          gtm_container_id: string | null
          id: string
          name: string
          owner_id: string
          plan_tier: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          gtm_container_id?: string | null
          id?: string
          name?: string
          owner_id: string
          plan_tier?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          gtm_container_id?: string | null
          id?: string
          name?: string
          owner_id?: string
          plan_tier?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_queue_position: { Args: never; Returns: number }
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: { p_event_type: string; p_metadata: Json; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      link_status: "active" | "paused" | "archived"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      link_status: ["active", "paused", "archived"],
    },
  },
} as const
