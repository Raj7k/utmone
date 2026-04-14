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
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_name: string
          key_prefix: string
          last_used_at: string | null
          rate_limit: number | null
          rate_limit_window: string | null
          requests_this_window: number | null
          scopes: string[] | null
          window_reset_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_name: string
          key_prefix: string
          last_used_at?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          requests_this_window?: number | null
          scopes?: string[] | null
          window_reset_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_name?: string
          key_prefix?: string
          last_used_at?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          requests_this_window?: number | null
          scopes?: string[] | null
          window_reset_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
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
      domains: {
        Row: {
          created_at: string | null
          created_by: string | null
          domain: string
          domain_settings: Json | null
          id: string
          is_primary: boolean | null
          is_system_domain: boolean | null
          is_verified: boolean | null
          verification_code: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          domain: string
          domain_settings?: Json | null
          id?: string
          is_primary?: boolean | null
          is_system_domain?: boolean | null
          is_verified?: boolean | null
          verification_code?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          domain?: string
          domain_settings?: Json | null
          id?: string
          is_primary?: boolean | null
          is_system_domain?: boolean | null
          is_verified?: boolean | null
          verification_code?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "domains_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
          os: string | null
          referrer: string | null
          user_agent: string | null
          visitor_id: string | null
          workspace_id: string
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
          os?: string | null
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
          workspace_id: string
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
          os?: string | null
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
          workspace_id?: string
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
            foreignKeyName: "link_clicks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          clicks_last_30_days: number
          created_at: string
          created_by: string
          description: string | null
          destination_url: string
          domain: string | null
          expires_at: string | null
          fallback_url: string | null
          geo_targets: Json | null
          id: string
          max_clicks: number | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          password: string | null
          password_hash: string | null
          redirect_type: string | null
          rejection_reason: string | null
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
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          clicks_last_30_days?: number
          created_at?: string
          created_by: string
          description?: string | null
          destination_url: string
          domain?: string | null
          expires_at?: string | null
          fallback_url?: string | null
          geo_targets?: Json | null
          id?: string
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          password?: string | null
          password_hash?: string | null
          redirect_type?: string | null
          rejection_reason?: string | null
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
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          clicks_last_30_days?: number
          created_at?: string
          created_by?: string
          description?: string | null
          destination_url?: string
          domain?: string | null
          expires_at?: string | null
          fallback_url?: string | null
          geo_targets?: Json | null
          id?: string
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          password?: string | null
          password_hash?: string | null
          redirect_type?: string | null
          rejection_reason?: string | null
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
      password_attempts: {
        Row: {
          attempt_count: number
          first_attempt_at: string
          id: string
          ip_address: string
          last_attempt_at: string
          link_id: string
          locked_until: string | null
        }
        Insert: {
          attempt_count?: number
          first_attempt_at?: string
          id?: string
          ip_address: string
          last_attempt_at?: string
          link_id: string
          locked_until?: string | null
        }
        Update: {
          attempt_count?: number
          first_attempt_at?: string
          id?: string
          ip_address?: string
          last_attempt_at?: string
          link_id?: string
          locked_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "password_attempts_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_analytics_viewed_at: string | null
          first_link_created_at: string | null
          first_qr_generated_at: string | null
          full_name: string | null
          has_seen_welcome_modal: boolean | null
          icp_role: string | null
          id: string
          onboarding_completed: boolean | null
          primary_use_case: string | null
          team_members_invited_count: number | null
          timezone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_analytics_viewed_at?: string | null
          first_link_created_at?: string | null
          first_qr_generated_at?: string | null
          full_name?: string | null
          has_seen_welcome_modal?: boolean | null
          icp_role?: string | null
          id: string
          onboarding_completed?: boolean | null
          primary_use_case?: string | null
          team_members_invited_count?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_analytics_viewed_at?: string | null
          first_link_created_at?: string | null
          first_qr_generated_at?: string | null
          full_name?: string | null
          has_seen_welcome_modal?: boolean | null
          icp_role?: string | null
          id?: string
          onboarding_completed?: boolean | null
          primary_use_case?: string | null
          team_members_invited_count?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      workspace_members: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
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
      api_keys_public: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string | null
          is_active: boolean | null
          key_name: string | null
          key_prefix: string | null
          last_used_at: string | null
          rate_limit: number | null
          rate_limit_window: string | null
          requests_this_window: number | null
          scopes: string[] | null
          window_reset_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          is_active?: boolean | null
          key_name?: string | null
          key_prefix?: string | null
          last_used_at?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          requests_this_window?: number | null
          scopes?: string[] | null
          window_reset_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          is_active?: boolean | null
          key_name?: string | null
          key_prefix?: string | null
          last_used_at?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          requests_this_window?: number | null
          scopes?: string[] | null
          window_reset_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_queue_position: { Args: never; Returns: number }
      check_password_attempts: {
        Args: { p_ip_address: string; p_link_id: string; p_success?: boolean }
        Returns: Json
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      generate_referral_code: { Args: never; Returns: string }
      get_channel_lift: { Args: { p_workspace_id: string }; Returns: Json }
      get_conversion_velocity: {
        Args: { p_workspace_id: string }
        Returns: Json
      }
      get_dashboard_summary: {
        Args: { p_user_id?: string; p_workspace_id: string }
        Returns: Json
      }
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
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
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
