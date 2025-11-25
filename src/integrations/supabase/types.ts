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
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          insight_type: string
          metadata: Json | null
          summary_text: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          summary_text: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          summary_text?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          description: string
          dismissed: boolean | null
          dismissed_at: string | null
          dismissed_by: string | null
          id: string
          recommendation_type: string
          title: string
          workspace_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          description: string
          dismissed?: boolean | null
          dismissed_at?: string | null
          dismissed_by?: string | null
          id?: string
          recommendation_type: string
          title: string
          workspace_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          description?: string
          dismissed?: boolean | null
          dismissed_at?: string | null
          dismissed_by?: string | null
          id?: string
          recommendation_type?: string
          title?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_configurations: {
        Row: {
          alert_name: string
          comparison_operator: string
          created_at: string
          created_by: string | null
          email_enabled: boolean | null
          email_recipients: string[] | null
          id: string
          is_enabled: boolean | null
          metric_type: string
          slack_enabled: boolean | null
          slack_webhook_url: string | null
          threshold_value: number
          updated_at: string
          webhook_enabled: boolean | null
          webhook_url: string | null
        }
        Insert: {
          alert_name: string
          comparison_operator: string
          created_at?: string
          created_by?: string | null
          email_enabled?: boolean | null
          email_recipients?: string[] | null
          id?: string
          is_enabled?: boolean | null
          metric_type: string
          slack_enabled?: boolean | null
          slack_webhook_url?: string | null
          threshold_value: number
          updated_at?: string
          webhook_enabled?: boolean | null
          webhook_url?: string | null
        }
        Update: {
          alert_name?: string
          comparison_operator?: string
          created_at?: string
          created_by?: string | null
          email_enabled?: boolean | null
          email_recipients?: string[] | null
          id?: string
          is_enabled?: boolean | null
          metric_type?: string
          slack_enabled?: boolean | null
          slack_webhook_url?: string | null
          threshold_value?: number
          updated_at?: string
          webhook_enabled?: boolean | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      analytics_anomalies: {
        Row: {
          anomaly_type: string
          baseline_value: number | null
          change_percent: number | null
          created_at: string | null
          current_value: number | null
          description: string
          detected_at: string | null
          id: string
          is_dismissed: boolean | null
          link_id: string | null
          metadata: Json | null
          severity: string
          title: string
          workspace_id: string
        }
        Insert: {
          anomaly_type: string
          baseline_value?: number | null
          change_percent?: number | null
          created_at?: string | null
          current_value?: number | null
          description: string
          detected_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          link_id?: string | null
          metadata?: Json | null
          severity: string
          title: string
          workspace_id: string
        }
        Update: {
          anomaly_type?: string
          baseline_value?: number | null
          change_percent?: number | null
          created_at?: string | null
          current_value?: number | null
          description?: string
          detected_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          link_id?: string | null
          metadata?: Json | null
          severity?: string
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_anomalies_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_anomalies_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "analytics_anomalies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_share_links: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          show_campaigns: boolean | null
          show_clicks: boolean | null
          show_devices: boolean | null
          show_geography: boolean | null
          token: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          show_campaigns?: boolean | null
          show_clicks?: boolean | null
          show_devices?: boolean | null
          show_geography?: boolean | null
          token?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          show_campaigns?: boolean | null
          show_clicks?: boolean | null
          show_devices?: boolean | null
          show_geography?: boolean | null
          token?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_share_links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_clicks: {
        Row: {
          announcement_id: string
          created_at: string | null
          cta_link: string | null
          id: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          announcement_id: string
          created_at?: string | null
          cta_link?: string | null
          id?: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          announcement_id?: string
          created_at?: string | null
          cta_link?: string | null
          id?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      announcement_configs: {
        Row: {
          config_id: string
          created_at: string | null
          created_by: string | null
          cta_link: string | null
          cta_text: string | null
          days_of_week: number[] | null
          end_date: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number
          rotation_group: string | null
          rotation_interval_minutes: number | null
          start_date: string | null
          time_range_end: string | null
          time_range_start: string | null
          updated_at: string | null
          user_segment: string | null
        }
        Insert: {
          config_id: string
          created_at?: string | null
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          days_of_week?: number[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number
          rotation_group?: string | null
          rotation_interval_minutes?: number | null
          start_date?: string | null
          time_range_end?: string | null
          time_range_start?: string | null
          updated_at?: string | null
          user_segment?: string | null
        }
        Update: {
          config_id?: string
          created_at?: string | null
          created_by?: string | null
          cta_link?: string | null
          cta_text?: string | null
          days_of_week?: number[] | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number
          rotation_group?: string | null
          rotation_interval_minutes?: number | null
          start_date?: string | null
          time_range_end?: string | null
          time_range_start?: string | null
          updated_at?: string | null
          user_segment?: string | null
        }
        Relationships: []
      }
      announcement_dismissals: {
        Row: {
          announcement_id: string
          created_at: string | null
          id: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          announcement_id: string
          created_at?: string | null
          id?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      announcement_impressions: {
        Row: {
          announcement_id: string
          created_at: string | null
          id: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
          user_segment: string | null
        }
        Insert: {
          announcement_id: string
          created_at?: string | null
          id?: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
          user_segment?: string | null
        }
        Update: {
          announcement_id?: string
          created_at?: string | null
          id?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
          user_segment?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
      api_usage: {
        Row: {
          api_key_id: string | null
          endpoint: string
          id: string
          method: string
          response_time_ms: number | null
          status_code: number | null
          timestamp: string | null
        }
        Insert: {
          api_key_id?: string | null
          endpoint: string
          id?: string
          method: string
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string | null
        }
        Update: {
          api_key_id?: string | null
          endpoint?: string
          id?: string
          method?: string
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_logs: {
        Row: {
          backup_type: string
          created_at: string
          error_message: string | null
          file_path: string | null
          id: string
          status: string
          workspace_id: string
        }
        Insert: {
          backup_type: string
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: string
          status: string
          workspace_id: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: string
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_schedules: {
        Row: {
          backup_type: string
          config: Json | null
          created_at: string | null
          frequency: string
          id: string
          is_enabled: boolean | null
          last_backup_at: string | null
          next_backup_at: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          backup_type?: string
          config?: Json | null
          created_at?: string | null
          frequency?: string
          id?: string
          is_enabled?: boolean | null
          last_backup_at?: string | null
          next_backup_at?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          backup_type?: string
          config?: Json | null
          created_at?: string | null
          frequency?: string
          id?: string
          is_enabled?: boolean | null
          last_backup_at?: string | null
          next_backup_at?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_schedules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_events: {
        Row: {
          attributed_at: string
          click_id: string | null
          created_at: string
          currency: string | null
          event_name: string | null
          event_type: string
          event_value: number | null
          id: string
          link_id: string
          metadata: Json | null
          user_identifier: string | null
          workspace_id: string
        }
        Insert: {
          attributed_at?: string
          click_id?: string | null
          created_at?: string
          currency?: string | null
          event_name?: string | null
          event_type: string
          event_value?: number | null
          id?: string
          link_id: string
          metadata?: Json | null
          user_identifier?: string | null
          workspace_id: string
        }
        Update: {
          attributed_at?: string
          click_id?: string | null
          created_at?: string
          currency?: string | null
          event_name?: string | null
          event_type?: string
          event_value?: number | null
          id?: string
          link_id?: string
          metadata?: Json | null
          user_identifier?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversion_events_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "link_clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversion_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversion_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "conversion_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      data_export_requests: {
        Row: {
          created_at: string | null
          expires_at: string | null
          export_url: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          export_url?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          export_url?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_export_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_health_logs: {
        Row: {
          check_type: string
          checked_at: string | null
          details: Json | null
          domain_id: string | null
          id: string
          response_time_ms: number | null
          status: string
        }
        Insert: {
          check_type: string
          checked_at?: string | null
          details?: Json | null
          domain_id?: string | null
          id?: string
          response_time_ms?: number | null
          status: string
        }
        Update: {
          check_type?: string
          checked_at?: string | null
          details?: Json | null
          domain_id?: string | null
          id?: string
          response_time_ms?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "domain_health_logs_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string | null
          created_by: string
          dns_verified_at: string | null
          domain: string
          domain_settings: Json | null
          health_status: string | null
          id: string
          is_primary: boolean | null
          is_system_domain: boolean | null
          is_verified: boolean | null
          last_health_check: string | null
          ssl_expires_at: string | null
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
          domain_settings?: Json | null
          health_status?: string | null
          id?: string
          is_primary?: boolean | null
          is_system_domain?: boolean | null
          is_verified?: boolean | null
          last_health_check?: string | null
          ssl_expires_at?: string | null
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
          domain_settings?: Json | null
          health_status?: string | null
          id?: string
          is_primary?: boolean | null
          is_system_domain?: boolean | null
          is_verified?: boolean | null
          last_health_check?: string | null
          ssl_expires_at?: string | null
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
          fraud_risk_score: number | null
          how_heard: string | null
          id: string
          is_flagged: boolean | null
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
          fraud_risk_score?: number | null
          how_heard?: string | null
          id?: string
          is_flagged?: boolean | null
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
          fraud_risk_score?: number | null
          how_heard?: string | null
          id?: string
          is_flagged?: boolean | null
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
      email_campaigns: {
        Row: {
          campaign_type: string
          created_at: string | null
          html_content: string
          id: string
          is_active: boolean | null
          send_delay_days: number | null
          subject: string
          template_name: string
          updated_at: string | null
        }
        Insert: {
          campaign_type: string
          created_at?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          send_delay_days?: number | null
          subject: string
          template_name: string
          updated_at?: string | null
        }
        Update: {
          campaign_type?: string
          created_at?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          send_delay_days?: number | null
          subject?: string
          template_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          created_at: string | null
          id: string
          opened_at: string | null
          scheduled_at: string
          sent_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_queue_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "early_access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          category: string
          created_at: string | null
          description: string
          flag_key: string
          id: string
          is_enabled: boolean
          last_modified_at: string | null
          last_modified_by: string | null
          metadata: Json | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description: string
          flag_key: string
          id?: string
          is_enabled?: boolean
          last_modified_at?: string | null
          last_modified_by?: string | null
          metadata?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          flag_key?: string
          id?: string
          is_enabled?: boolean
          last_modified_at?: string | null
          last_modified_by?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      flag_recommendations: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          confidence_score: number
          created_at: string
          current_system_load: string | null
          current_traffic_pattern: string | null
          expected_impact: Json | null
          expires_at: string
          flag_key: string
          historical_data_points: number | null
          id: string
          reason: string
          recommendation_type: string
          status: string | null
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          confidence_score: number
          created_at?: string
          current_system_load?: string | null
          current_traffic_pattern?: string | null
          expected_impact?: Json | null
          expires_at?: string
          flag_key: string
          historical_data_points?: number | null
          id?: string
          reason: string
          recommendation_type: string
          status?: string | null
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          confidence_score?: number
          created_at?: string
          current_system_load?: string | null
          current_traffic_pattern?: string | null
          expected_impact?: Json | null
          expires_at?: string
          flag_key?: string
          historical_data_points?: number | null
          id?: string
          reason?: string
          recommendation_type?: string
          status?: string | null
        }
        Relationships: []
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
      fraud_detection_logs: {
        Row: {
          details: Json | null
          detection_type: string
          flagged_at: string | null
          id: string
          risk_score: number
          user_id: string | null
        }
        Insert: {
          details?: Json | null
          detection_type: string
          flagged_at?: string | null
          id?: string
          risk_score: number
          user_id?: string | null
        }
        Update: {
          details?: Json | null
          detection_type?: string
          flagged_at?: string | null
          id?: string
          risk_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_detection_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "early_access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_scores: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          link_id: string | null
          risk_factors: Json | null
          risk_score: number | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          link_id?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          link_id?: string | null
          risk_factors?: Json | null
          risk_score?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_scores_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_scores_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          refresh_token: string | null
          workspace_id: string
        }
        Insert: {
          access_token?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          refresh_token?: string | null
          workspace_id: string
        }
        Update: {
          access_token?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          refresh_token?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_workspace_id_fkey"
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
      link_change_history: {
        Row: {
          change_type: string
          changed_by: string
          created_at: string | null
          field_name: string | null
          id: string
          link_id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          change_type: string
          changed_by: string
          created_at?: string | null
          field_name?: string | null
          id?: string
          link_id: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string
          created_at?: string | null
          field_name?: string | null
          id?: string
          link_id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_change_history_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_change_history_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
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
          targeting_rule_id: string | null
          targeting_rule_name: string | null
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
          targeting_rule_id?: string | null
          targeting_rule_name?: string | null
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
          targeting_rule_id?: string | null
          targeting_rule_name?: string | null
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
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
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
          {
            foreignKeyName: "link_clicks_targeting_rule_id_fkey"
            columns: ["targeting_rule_id"]
            isOneToOne: false
            referencedRelation: "targeting_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      link_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          link_id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          link_id: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          link_id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_comments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_comments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "link_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "link_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      link_drafts: {
        Row: {
          created_at: string | null
          draft_data: Json
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          draft_data: Json
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          draft_data?: Json
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      link_previews: {
        Row: {
          cached_at: string | null
          destination_url: string
          expires_at: string | null
          favicon_url: string | null
          id: string
          is_safe: boolean | null
          is_ssl_secure: boolean | null
          link_id: string | null
          og_image_url: string | null
          page_title: string | null
          threats: Json | null
        }
        Insert: {
          cached_at?: string | null
          destination_url: string
          expires_at?: string | null
          favicon_url?: string | null
          id?: string
          is_safe?: boolean | null
          is_ssl_secure?: boolean | null
          link_id?: string | null
          og_image_url?: string | null
          page_title?: string | null
          threats?: Json | null
        }
        Update: {
          cached_at?: string | null
          destination_url?: string
          expires_at?: string | null
          favicon_url?: string | null
          id?: string
          is_safe?: boolean | null
          is_ssl_secure?: boolean | null
          link_id?: string | null
          og_image_url?: string | null
          page_title?: string | null
          threats?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "link_previews_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_previews_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
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
          {
            foreignKeyName: "link_tags_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
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
          approval_notes: string | null
          approval_status: string | null
          blacklist_status: string | null
          conversion_rate: number | null
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
          password_hash: string | null
          password_hint: string | null
          path: string
          pending_approval_by: string | null
          redirect_type: string | null
          security_status: Database["public"]["Enums"]["security_status"] | null
          short_url: string | null
          slug: string
          status: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at: string | null
          title: string
          total_clicks: number | null
          total_conversions: number | null
          total_revenue: number | null
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
          approval_notes?: string | null
          approval_status?: string | null
          blacklist_status?: string | null
          conversion_rate?: number | null
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
          password_hash?: string | null
          password_hint?: string | null
          path?: string
          pending_approval_by?: string | null
          redirect_type?: string | null
          security_status?:
            | Database["public"]["Enums"]["security_status"]
            | null
          short_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at?: string | null
          title: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_revenue?: number | null
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
          approval_notes?: string | null
          approval_status?: string | null
          blacklist_status?: string | null
          conversion_rate?: number | null
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
          password_hash?: string | null
          password_hint?: string | null
          path?: string
          pending_approval_by?: string | null
          redirect_type?: string | null
          security_status?:
            | Database["public"]["Enums"]["security_status"]
            | null
          short_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at?: string | null
          title?: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_revenue?: number | null
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
      metrics_snapshots: {
        Row: {
          cache_hit_rate_after: number | null
          cache_hit_rate_before: number | null
          cache_hit_rate_impact: number | null
          changed_by: string | null
          created_at: string
          error_rate_after: number | null
          error_rate_before: number | null
          error_rate_impact: number | null
          flag_enabled: boolean
          flag_key: string
          id: string
          latency_impact: number | null
          latency_p95_after: number | null
          latency_p95_before: number | null
          metadata: Json | null
          system_load: string | null
          timestamp: string
          traffic_pattern: string | null
        }
        Insert: {
          cache_hit_rate_after?: number | null
          cache_hit_rate_before?: number | null
          cache_hit_rate_impact?: number | null
          changed_by?: string | null
          created_at?: string
          error_rate_after?: number | null
          error_rate_before?: number | null
          error_rate_impact?: number | null
          flag_enabled: boolean
          flag_key: string
          id?: string
          latency_impact?: number | null
          latency_p95_after?: number | null
          latency_p95_before?: number | null
          metadata?: Json | null
          system_load?: string | null
          timestamp?: string
          traffic_pattern?: string | null
        }
        Update: {
          cache_hit_rate_after?: number | null
          cache_hit_rate_before?: number | null
          cache_hit_rate_impact?: number | null
          changed_by?: string | null
          created_at?: string
          error_rate_after?: number | null
          error_rate_before?: number | null
          error_rate_impact?: number | null
          flag_enabled?: boolean
          flag_key?: string
          id?: string
          latency_impact?: number | null
          latency_p95_after?: number | null
          latency_p95_before?: number | null
          metadata?: Json | null
          system_load?: string | null
          timestamp?: string
          traffic_pattern?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "og_image_variants_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
      }
      onboarding_analytics: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          skipped: boolean | null
          started_at: string | null
          step_name: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          skipped?: boolean | null
          started_at?: string | null
          step_name: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          skipped?: boolean | null
          started_at?: string | null
          step_name?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_analytics_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          amount: number
          completed_at: string | null
          id: string
          invoice_url: string | null
          method: string
          notes: string | null
          partner_id: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string | null
          status: string | null
          tax_form_url: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          id?: string
          invoice_url?: string | null
          method: string
          notes?: string | null
          partner_id: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string | null
          status?: string | null
          tax_form_url?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          id?: string
          invoice_url?: string | null
          method?: string
          notes?: string | null
          partner_id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string | null
          status?: string | null
          tax_form_url?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_referrals: {
        Row: {
          commission_earned: number | null
          commission_paid: boolean | null
          conversion_date: string | null
          conversion_value: number | null
          created_at: string | null
          first_payment_date: string | null
          id: string
          partner_id: string
          referral_code: string
          referred_user_id: string | null
          signup_date: string | null
          status: string | null
        }
        Insert: {
          commission_earned?: number | null
          commission_paid?: boolean | null
          conversion_date?: string | null
          conversion_value?: number | null
          created_at?: string | null
          first_payment_date?: string | null
          id?: string
          partner_id: string
          referral_code: string
          referred_user_id?: string | null
          signup_date?: string | null
          status?: string | null
        }
        Update: {
          commission_earned?: number | null
          commission_paid?: boolean | null
          conversion_date?: string | null
          conversion_value?: number | null
          created_at?: string | null
          first_payment_date?: string | null
          id?: string
          partner_id?: string
          referral_code?: string
          referred_user_id?: string | null
          signup_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          application_notes: string | null
          approved_at: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          last_payout_at: string | null
          lifetime_payout: number | null
          partner_code: string
          payment_email: string | null
          payment_method: string | null
          pending_payout: number | null
          referral_url: string | null
          status: string | null
          stripe_connect_id: string | null
          total_conversions: number | null
          total_earnings: number | null
          total_referrals: number | null
          total_revenue: number | null
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          application_notes?: string | null
          approved_at?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          last_payout_at?: string | null
          lifetime_payout?: number | null
          partner_code: string
          payment_email?: string | null
          payment_method?: string | null
          pending_payout?: number | null
          referral_url?: string | null
          status?: string | null
          stripe_connect_id?: string | null
          total_conversions?: number | null
          total_earnings?: number | null
          total_referrals?: number | null
          total_revenue?: number | null
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          application_notes?: string | null
          approved_at?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          last_payout_at?: string | null
          lifetime_payout?: number | null
          partner_code?: string
          payment_email?: string | null
          payment_method?: string | null
          pending_payout?: number | null
          referral_url?: string | null
          status?: string | null
          stripe_connect_id?: string | null
          total_conversions?: number | null
          total_earnings?: number | null
          total_referrals?: number | null
          total_revenue?: number | null
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_level: number | null
          activation_score: number | null
          avatar_url: string | null
          created_at: string | null
          data_retention_days: number | null
          email: string
          first_analytics_viewed_at: string | null
          first_link_created_at: string | null
          first_qr_generated_at: string | null
          full_name: string | null
          id: string
          is_super_admin: boolean | null
          onboarding_completed: boolean | null
          team_members_invited_count: number | null
          tracking_consent: boolean | null
          updated_at: string | null
        }
        Insert: {
          access_level?: number | null
          activation_score?: number | null
          avatar_url?: string | null
          created_at?: string | null
          data_retention_days?: number | null
          email: string
          first_analytics_viewed_at?: string | null
          first_link_created_at?: string | null
          first_qr_generated_at?: string | null
          full_name?: string | null
          id: string
          is_super_admin?: boolean | null
          onboarding_completed?: boolean | null
          team_members_invited_count?: number | null
          tracking_consent?: boolean | null
          updated_at?: string | null
        }
        Update: {
          access_level?: number | null
          activation_score?: number | null
          avatar_url?: string | null
          created_at?: string | null
          data_retention_days?: number | null
          email?: string
          first_analytics_viewed_at?: string | null
          first_link_created_at?: string | null
          first_qr_generated_at?: string | null
          full_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          onboarding_completed?: boolean | null
          team_members_invited_count?: number | null
          tracking_consent?: boolean | null
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
          {
            foreignKeyName: "qr_codes_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
      }
      rate_limit_log: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: string
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string
          window_start?: string | null
        }
        Relationships: []
      }
      report_downloads: {
        Row: {
          company: string | null
          created_at: string | null
          download_url: string | null
          email: string
          full_name: string
          id: string
          job_title: string
          sent_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          download_url?: string | null
          email: string
          full_name: string
          id?: string
          job_title: string
          sent_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          download_url?: string | null
          email?: string
          full_name?: string
          id?: string
          job_title?: string
          sent_at?: string | null
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          custom_cron: string | null
          frequency: Database["public"]["Enums"]["report_frequency"]
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          next_send_at: string
          recipients: string[]
          template_name: Database["public"]["Enums"]["report_template"]
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          custom_cron?: string | null
          frequency: Database["public"]["Enums"]["report_frequency"]
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          next_send_at: string
          recipients: string[]
          template_name: Database["public"]["Enums"]["report_template"]
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          custom_cron?: string | null
          frequency?: Database["public"]["Enums"]["report_frequency"]
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          next_send_at?: string
          recipients?: string[]
          template_name?: Database["public"]["Enums"]["report_template"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      targeting_rules: {
        Row: {
          condition: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          link_id: string
          priority: number | null
          redirect_url: string
          rule_name: string
          rule_type: string
          updated_at: string | null
          value: string[]
        }
        Insert: {
          condition: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          link_id: string
          priority?: number | null
          redirect_url: string
          rule_name: string
          rule_type: string
          updated_at?: string | null
          value: string[]
        }
        Update: {
          condition?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          link_id?: string
          priority?: number | null
          redirect_url?: string
          rule_name?: string
          rule_type?: string
          updated_at?: string | null
          value?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "targeting_rules_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "targeting_rules_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
      }
      user_dashboard_preferences: {
        Row: {
          created_at: string | null
          hidden_widgets: Json | null
          id: string
          layout_preset: string | null
          updated_at: string | null
          user_id: string | null
          widget_order: Json | null
        }
        Insert: {
          created_at?: string | null
          hidden_widgets?: Json | null
          id?: string
          layout_preset?: string | null
          updated_at?: string | null
          user_id?: string | null
          widget_order?: Json | null
        }
        Update: {
          created_at?: string | null
          hidden_widgets?: Json | null
          id?: string
          layout_preset?: string | null
          updated_at?: string | null
          user_id?: string | null
          widget_order?: Json | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          notification_type: string
          read_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      webhook_subscriptions: {
        Row: {
          created_at: string | null
          created_by: string | null
          event_type: string
          id: string
          is_active: boolean | null
          secret: string | null
          webhook_url: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          secret?: string | null
          webhook_url: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          secret?: string | null
          webhook_url?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_branding: {
        Row: {
          company_name: string | null
          created_at: string | null
          custom_domain: string | null
          custom_footer_text: string | null
          favicon_url: string | null
          hide_utm_one_branding: boolean | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          support_email: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          custom_domain?: string | null
          custom_footer_text?: string | null
          favicon_url?: string | null
          hide_utm_one_branding?: boolean | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          support_email?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          custom_domain?: string | null
          custom_footer_text?: string | null
          favicon_url?: string | null
          hide_utm_one_branding?: boolean | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          support_email?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_branding_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          invited_by_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invited_by_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invited_by_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_workspace_id_fkey"
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
      workspace_usage: {
        Row: {
          api_requests: number | null
          created_at: string | null
          id: string
          links_created: number | null
          period_end: string
          period_start: string
          total_clicks: number | null
          workspace_id: string | null
        }
        Insert: {
          api_requests?: number | null
          created_at?: string | null
          id?: string
          links_created?: number | null
          period_end: string
          period_start: string
          total_clicks?: number | null
          workspace_id?: string | null
        }
        Update: {
          api_requests?: number | null
          created_at?: string | null
          id?: string
          links_created?: number | null
          period_end?: string
          period_start?: string
          total_clicks?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_usage_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          analytics_retention_days: number | null
          created_at: string | null
          custom_domain_limit: number | null
          default_domain: string | null
          default_path: string | null
          description: string | null
          gtm_container_id: string | null
          id: string
          is_client_workspace: boolean | null
          monthly_clicks_limit: number | null
          monthly_link_count: number | null
          monthly_link_limit: number | null
          name: string
          onboarding_completed: boolean | null
          owner_id: string
          parent_workspace_id: string | null
          plan_expires_at: string | null
          plan_started_at: string | null
          plan_tier: Database["public"]["Enums"]["plan_tier"] | null
          primary_domain: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          analytics_retention_days?: number | null
          created_at?: string | null
          custom_domain_limit?: number | null
          default_domain?: string | null
          default_path?: string | null
          description?: string | null
          gtm_container_id?: string | null
          id?: string
          is_client_workspace?: boolean | null
          monthly_clicks_limit?: number | null
          monthly_link_count?: number | null
          monthly_link_limit?: number | null
          name: string
          onboarding_completed?: boolean | null
          owner_id: string
          parent_workspace_id?: string | null
          plan_expires_at?: string | null
          plan_started_at?: string | null
          plan_tier?: Database["public"]["Enums"]["plan_tier"] | null
          primary_domain?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          analytics_retention_days?: number | null
          created_at?: string | null
          custom_domain_limit?: number | null
          default_domain?: string | null
          default_path?: string | null
          description?: string | null
          gtm_container_id?: string | null
          id?: string
          is_client_workspace?: boolean | null
          monthly_clicks_limit?: number | null
          monthly_link_count?: number | null
          monthly_link_limit?: number | null
          name?: string
          onboarding_completed?: boolean | null
          owner_id?: string
          parent_workspace_id?: string | null
          plan_expires_at?: string | null
          plan_started_at?: string | null
          plan_tier?: Database["public"]["Enums"]["plan_tier"] | null
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
          {
            foreignKeyName: "workspaces_parent_workspace_id_fkey"
            columns: ["parent_workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_click_time_series: {
        Row: {
          click_date: string | null
          link_id: string | null
          total_clicks: number | null
          unique_clicks: number | null
          workspace_id: string | null
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
      mv_device_analytics: {
        Row: {
          browser: string | null
          click_count: number | null
          device_type: string | null
          os: string | null
          unique_clicks: number | null
          workspace_id: string | null
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
      mv_geolocation_analytics: {
        Row: {
          city: string | null
          click_count: number | null
          country: string | null
          unique_clicks: number | null
          workspace_id: string | null
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
      mv_utm_campaign_analytics: {
        Row: {
          last_clicked_at: string | null
          total_clicks: number | null
          total_links: number | null
          unique_clicks: number | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          workspace_id: string | null
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
      waitlist_analytics: {
        Row: {
          avg_engagement_score: number | null
          avg_fit_score: number | null
          avg_total_score: number | null
          flagged_users: number | null
          referral_based_signups: number | null
          signups_last_30_days: number | null
          signups_last_7_days: number | null
          total_approved: number | null
          total_waitlist: number | null
          unique_companies: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_ip_address: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      generate_invite_token: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      generate_verification_code: { Args: never; Returns: string }
      get_device_analytics: {
        Args: { p_workspace_id: string }
        Returns: {
          browser: string
          click_count: number
          device_type: string
          os: string
          unique_clicks: number
          workspace_id: string
        }[]
      }
      get_feature_flag: { Args: { flag_name: string }; Returns: boolean }
      get_geolocation_analytics: {
        Args: { p_workspace_id: string }
        Returns: {
          city: string
          click_count: number
          country: string
          unique_clicks: number
          workspace_id: string
        }[]
      }
      get_link_analytics: {
        Args: { p_workspace_id: string }
        Returns: {
          clicks_last_30_days: number
          clicks_last_7_days: number
          created_at: string
          created_by: string
          destination_url: string
          last_clicked_at: string
          link_id: string
          short_url: string
          title: string
          total_clicks: number
          unique_clicks: number
          workspace_id: string
        }[]
      }
      get_profile_by_email_secure: {
        Args: { p_email: string }
        Returns: {
          email: string
          full_name: string
          id: string
        }[]
      }
      get_time_series_analytics: {
        Args: { p_days?: number; p_link_id?: string; p_workspace_id: string }
        Returns: {
          click_date: string
          link_id: string
          total_clicks: number
          unique_clicks: number
          workspace_id: string
        }[]
      }
      get_utm_analytics: {
        Args: { p_workspace_id: string }
        Returns: {
          last_clicked_at: string
          total_clicks: number
          total_links: number
          unique_clicks: number
          utm_campaign: string
          utm_content: string
          utm_medium: string
          utm_source: string
          utm_term: string
          workspace_id: string
        }[]
      }
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
      increment_link_clicks: {
        Args: {
          p_link_id: string
          p_total_increment: number
          p_unique_increment: number
        }
        Returns: undefined
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_owner: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_owner_direct: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_admin_user_id: string
          p_ip_address?: string
          p_new_values?: Json
          p_old_values?: Json
          p_resource_id: string
          p_resource_type: string
          p_user_agent?: string
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_event_type: string
          p_ip_address?: string
          p_metadata?: Json
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
      refresh_analytics_views: { Args: never; Returns: undefined }
      refresh_waitlist_analytics: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
      link_status: "active" | "paused" | "archived"
      plan_tier: "free" | "pro" | "business" | "enterprise" | "lifetime"
      report_frequency: "daily" | "weekly" | "monthly" | "custom"
      report_template:
        | "weekly_summary"
        | "monthly_overview"
        | "campaign_performance"
      security_status: "safe" | "threats_detected" | "not_scanned" | "pending"
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
      plan_tier: ["free", "pro", "business", "enterprise", "lifetime"],
      report_frequency: ["daily", "weekly", "monthly", "custom"],
      report_template: [
        "weekly_summary",
        "monthly_overview",
        "campaign_performance",
      ],
      security_status: ["safe", "threats_detected", "not_scanned", "pending"],
      user_role: ["super_admin", "workspace_admin", "editor", "viewer"],
    },
  },
} as const
