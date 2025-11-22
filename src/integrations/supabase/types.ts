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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      domains: {
        Row: {
          created_at: string | null
          created_by: string
          dns_verified_at: string | null
          domain: string
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          ssl_status: string | null
          updated_at: string | null
          verification_code: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          dns_verified_at?: string | null
          domain: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          ssl_status?: string | null
          updated_at?: string | null
          verification_code?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          dns_verified_at?: string | null
          domain?: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          ssl_status?: string | null
          updated_at?: string | null
          verification_code?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domains_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      early_access_invites: {
        Row: {
          access_level: number
          claimed_at: string | null
          created_at: string | null
          created_by: string | null
          email: string
          expires_at: string
          id: string
          invite_token: string
        }
        Insert: {
          access_level?: number
          claimed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          email: string
          expires_at?: string
          id?: string
          invite_token: string
        }
        Update: {
          access_level?: number
          claimed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          invite_token?: string
        }
        Relationships: []
      }
      early_access_requests: {
        Row: {
          access_level: number | null
          company_domain: string | null
          created_at: string | null
          desired_domain: string | null
          email: string
          engagement_score: number | null
          fit_score: number | null
          how_heard: string | null
          id: string
          name: string
          reason_details: string | null
          reason_for_joining: string | null
          referral_code: string | null
          referral_score: number | null
          referred_by: string | null
          role: string | null
          status: string | null
          team_size: string
          total_access_score: number | null
          updated_at: string | null
        }
        Insert: {
          access_level?: number | null
          company_domain?: string | null
          created_at?: string | null
          desired_domain?: string | null
          email: string
          engagement_score?: number | null
          fit_score?: number | null
          how_heard?: string | null
          id?: string
          name: string
          reason_details?: string | null
          reason_for_joining?: string | null
          referral_code?: string | null
          referral_score?: number | null
          referred_by?: string | null
          role?: string | null
          status?: string | null
          team_size: string
          total_access_score?: number | null
          updated_at?: string | null
        }
        Update: {
          access_level?: number | null
          company_domain?: string | null
          created_at?: string | null
          desired_domain?: string | null
          email?: string
          engagement_score?: number | null
          fit_score?: number | null
          how_heard?: string | null
          id?: string
          name?: string
          reason_details?: string | null
          reason_for_joining?: string | null
          referral_code?: string | null
          referral_score?: number | null
          referred_by?: string | null
          role?: string | null
          status?: string | null
          team_size?: string
          total_access_score?: number | null
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
      folders: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          hero_variant: number
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          hero_variant: number
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          hero_variant?: number
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "landing_page_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      landing_page_sessions: {
        Row: {
          created_at: string | null
          hero_variant: number
          id: string
          ip_address: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          hero_variant: number
          id?: string
          ip_address?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          hero_variant?: number
          id?: string
          ip_address?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      link_clicks: {
        Row: {
          browser: string | null
          city: string | null
          clicked_at: string | null
          country: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_unique: boolean | null
          link_id: string
          og_variant_id: string | null
          os: string | null
          qr_code_id: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          clicked_at?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_unique?: boolean | null
          link_id: string
          og_variant_id?: string | null
          os?: string | null
          qr_code_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          clicked_at?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_unique?: boolean | null
          link_id?: string
          og_variant_id?: string | null
          os?: string | null
          qr_code_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_clicks_og_variant_id_fkey"
            columns: ["og_variant_id"]
            isOneToOne: false
            referencedRelation: "og_image_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_clicks_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      link_tags: {
        Row: {
          created_at: string | null
          id: string
          link_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_tags_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          ab_test_completed_at: string | null
          ab_test_confidence_threshold: number | null
          ab_test_min_clicks: number | null
          ab_test_started_at: string | null
          ab_test_status: string | null
          ab_test_winner_id: string | null
          created_at: string | null
          created_by: string
          custom_expiry_message: string | null
          description: string | null
          destination_url: string
          domain: string
          expires_at: string | null
          fallback_url: string | null
          final_url: string
          folder_id: string | null
          id: string
          last_clicked_at: string | null
          max_clicks: number | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          path: string
          redirect_type: string | null
          short_url: string | null
          slug: string
          status: Database["public"]["Enums"]["link_status"] | null
          title: string
          total_clicks: number | null
          unique_clicks: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          workspace_id: string
        }
        Insert: {
          ab_test_completed_at?: string | null
          ab_test_confidence_threshold?: number | null
          ab_test_min_clicks?: number | null
          ab_test_started_at?: string | null
          ab_test_status?: string | null
          ab_test_winner_id?: string | null
          created_at?: string | null
          created_by: string
          custom_expiry_message?: string | null
          description?: string | null
          destination_url: string
          domain?: string
          expires_at?: string | null
          fallback_url?: string | null
          final_url: string
          folder_id?: string | null
          id?: string
          last_clicked_at?: string | null
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path?: string
          redirect_type?: string | null
          short_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["link_status"] | null
          title: string
          total_clicks?: number | null
          unique_clicks?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id: string
        }
        Update: {
          ab_test_completed_at?: string | null
          ab_test_confidence_threshold?: number | null
          ab_test_min_clicks?: number | null
          ab_test_started_at?: string | null
          ab_test_status?: string | null
          ab_test_winner_id?: string | null
          created_at?: string | null
          created_by?: string
          custom_expiry_message?: string | null
          description?: string | null
          destination_url?: string
          domain?: string
          expires_at?: string | null
          fallback_url?: string | null
          final_url?: string
          folder_id?: string | null
          id?: string
          last_clicked_at?: string | null
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path?: string
          redirect_type?: string | null
          short_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["link_status"] | null
          title?: string
          total_clicks?: number | null
          unique_clicks?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_ab_test_winner_id_fkey"
            columns: ["ab_test_winner_id"]
            isOneToOne: false
            referencedRelation: "og_image_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      og_image_variants: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          link_id: string
          og_description: string | null
          og_image: string
          og_title: string | null
          variant_name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          link_id: string
          og_description?: string | null
          og_image: string
          og_title?: string | null
          variant_name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          link_id?: string
          og_description?: string | null
          og_image?: string
          og_title?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "og_image_variants_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "og_image_variants_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_level: number | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_super_admin: boolean | null
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          access_level?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_super_admin?: boolean | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          access_level?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          corner_style: string | null
          created_at: string | null
          created_by: string
          frame_text: string | null
          has_logo: boolean | null
          id: string
          link_id: string
          logo_url: string | null
          name: string
          pdf_url: string | null
          png_url: string | null
          primary_color: string | null
          secondary_color: string | null
          svg_url: string | null
          variant_name: string | null
        }
        Insert: {
          corner_style?: string | null
          created_at?: string | null
          created_by: string
          frame_text?: string | null
          has_logo?: boolean | null
          id?: string
          link_id: string
          logo_url?: string | null
          name: string
          pdf_url?: string | null
          png_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          svg_url?: string | null
          variant_name?: string | null
        }
        Update: {
          corner_style?: string | null
          created_at?: string | null
          created_by?: string
          frame_text?: string | null
          has_logo?: boolean | null
          id?: string
          link_id?: string
          logo_url?: string | null
          name?: string
          pdf_url?: string | null
          png_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          svg_url?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          auto_generate_slug: boolean | null
          auto_populate_utm: boolean | null
          created_at: string | null
          default_redirect_type: string | null
          id: string
          last_domain: string | null
          last_path: string | null
          last_utm_campaign: string | null
          last_utm_medium: string | null
          last_utm_source: string | null
          preferred_domain: string | null
          preferred_path: string | null
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          auto_generate_slug?: boolean | null
          auto_populate_utm?: boolean | null
          created_at?: string | null
          default_redirect_type?: string | null
          id?: string
          last_domain?: string | null
          last_path?: string | null
          last_utm_campaign?: string | null
          last_utm_medium?: string | null
          last_utm_source?: string | null
          preferred_domain?: string | null
          preferred_path?: string | null
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          auto_generate_slug?: boolean | null
          auto_populate_utm?: boolean | null
          created_at?: string | null
          default_redirect_type?: string | null
          id?: string
          last_domain?: string | null
          last_path?: string | null
          last_utm_campaign?: string | null
          last_utm_medium?: string | null
          last_utm_source?: string | null
          preferred_domain?: string | null
          preferred_path?: string | null
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      utm_templates: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "utm_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "utm_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_engagement_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          page_path: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
          waitlist_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          page_path?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          waitlist_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          waitlist_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_engagement_events_waitlist_user_id_fkey"
            columns: ["waitlist_user_id"]
            isOneToOne: false
            referencedRelation: "early_access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          default_domain: string | null
          default_path: string | null
          description: string | null
          id: string
          name: string
          onboarding_completed: boolean | null
          owner_id: string
          primary_domain: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_domain?: string | null
          default_path?: string | null
          description?: string | null
          id?: string
          name: string
          onboarding_completed?: boolean | null
          owner_id: string
          primary_domain?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_domain?: string | null
          default_path?: string | null
          description?: string | null
          id?: string
          name?: string
          onboarding_completed?: boolean | null
          owner_id?: string
          primary_domain?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
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
      generate_invite_token: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      generate_verification_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_workspace_access: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_owner: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      link_status: "active" | "paused" | "archived"
      user_role: "super_admin" | "workspace_admin" | "editor" | "viewer"
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
      app_role: ["admin", "user"],
      link_status: ["active", "paused", "archived"],
      user_role: ["super_admin", "workspace_admin", "editor", "viewer"],
    },
  },
} as const
