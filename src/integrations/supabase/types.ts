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
      ab_test_variants: {
        Row: {
          conversion_rate: number | null
          conversions: number | null
          created_at: string | null
          destination_url: string
          id: string
          performance_score: number | null
          test_id: string
          total_clicks: number | null
          traffic_percentage: number | null
          unique_clicks: number | null
          variant_name: string
        }
        Insert: {
          conversion_rate?: number | null
          conversions?: number | null
          created_at?: string | null
          destination_url: string
          id?: string
          performance_score?: number | null
          test_id: string
          total_clicks?: number | null
          traffic_percentage?: number | null
          unique_clicks?: number | null
          variant_name: string
        }
        Update: {
          conversion_rate?: number | null
          conversions?: number | null
          created_at?: string | null
          destination_url?: string
          id?: string
          performance_score?: number | null
          test_id?: string
          total_clicks?: number | null
          traffic_percentage?: number | null
          unique_clicks?: number | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_variants_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_tests: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          ended_at: string | null
          id: string
          link_id: string
          started_at: string | null
          status: string | null
          test_name: string
          traffic_split: Json | null
          updated_at: string | null
          winner_variant_id: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          link_id: string
          started_at?: string | null
          status?: string | null
          test_name: string
          traffic_split?: Json | null
          updated_at?: string | null
          winner_variant_id?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          link_id?: string
          started_at?: string | null
          status?: string | null
          test_name?: string
          traffic_split?: Json | null
          updated_at?: string | null
          winner_variant_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_tests_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_tests_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_tests_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "ab_tests_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          changed_by_role: string | null
          created_at: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          user_agent: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          changed_by_role?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          changed_by_role?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
          slack_webhook_url_encrypted: string | null
          threshold_value: number
          updated_at: string
          webhook_enabled: boolean | null
          webhook_url_encrypted: string | null
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
          slack_webhook_url_encrypted?: string | null
          threshold_value: number
          updated_at?: string
          webhook_enabled?: boolean | null
          webhook_url_encrypted?: string | null
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
          slack_webhook_url_encrypted?: string | null
          threshold_value?: number
          updated_at?: string
          webhook_enabled?: boolean | null
          webhook_url_encrypted?: string | null
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
          notification_sent_at: string | null
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
          notification_sent_at?: string | null
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
          notification_sent_at?: string | null
          severity?: string
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_anomalies_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
      analytics_refresh_status: {
        Row: {
          created_at: string
          duration_ms: number | null
          error: string | null
          id: string
          status: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          id?: string
          status: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          id?: string
          status?: string
          timestamp?: string
        }
        Relationships: []
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
      api_key_access_logs: {
        Row: {
          accessed_at: string
          api_key_id: string | null
          endpoint: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          api_key_id?: string | null
          endpoint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          api_key_id?: string | null
          endpoint?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_access_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
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
          last_rotated_at: string | null
          last_used_at: string | null
          rate_limit: number | null
          rate_limit_window: string | null
          requests_this_window: number | null
          rotation_policy_days: number | null
          rotation_required: boolean | null
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
          last_rotated_at?: string | null
          last_used_at?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          requests_this_window?: number | null
          rotation_policy_days?: number | null
          rotation_required?: boolean | null
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
          last_rotated_at?: string | null
          last_used_at?: string | null
          rate_limit?: number | null
          rate_limit_window?: string | null
          requests_this_window?: number | null
          rotation_policy_days?: number | null
          rotation_required?: boolean | null
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
      attribution_journeys: {
        Row: {
          conversion_event_id: string | null
          converted: boolean
          created_at: string
          id: string
          journey_end_at: string
          journey_start_at: string
          revenue: number | null
          touchpoints: Json
          updated_at: string
          visitor_id: string
          workspace_id: string
        }
        Insert: {
          conversion_event_id?: string | null
          converted?: boolean
          created_at?: string
          id?: string
          journey_end_at: string
          journey_start_at: string
          revenue?: number | null
          touchpoints?: Json
          updated_at?: string
          visitor_id: string
          workspace_id: string
        }
        Update: {
          conversion_event_id?: string | null
          converted?: boolean
          created_at?: string
          id?: string
          journey_end_at?: string
          journey_start_at?: string
          revenue?: number | null
          touchpoints?: Json
          updated_at?: string
          visitor_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribution_journeys_conversion_event_id_fkey"
            columns: ["conversion_event_id"]
            isOneToOne: false
            referencedRelation: "conversion_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribution_journeys_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          actor_id: string
          changes: Json | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          resource_id: string | null
          workspace_id: string
        }
        Insert: {
          actor_id: string
          changes?: Json | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          workspace_id: string
        }
        Update: {
          actor_id?: string
          changes?: Json | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_velocity_tracking: {
        Row: {
          actor_id: string
          event_count: number
          event_type: string
          flagged: boolean | null
          flagged_at: string | null
          id: string
          window_end: string
          window_start: string
          workspace_id: string
        }
        Insert: {
          actor_id: string
          event_count?: number
          event_type: string
          flagged?: boolean | null
          flagged_at?: string | null
          id?: string
          window_end?: string
          window_start?: string
          workspace_id: string
        }
        Update: {
          actor_id?: string
          event_count?: number
          event_type?: string
          flagged?: boolean | null
          flagged_at?: string | null
          id?: string
          window_end?: string
          window_start?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_velocity_tracking_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
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
      bulk_operations_log: {
        Row: {
          affected_count: number | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          id: string
          link_ids: string[]
          operation_type: string
          parameters: Json | null
          status: string | null
          workspace_id: string
        }
        Insert: {
          affected_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          link_ids: string[]
          operation_type: string
          parameters?: Json | null
          status?: string | null
          workspace_id: string
        }
        Update: {
          affected_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          link_ids?: string[]
          operation_type?: string
          parameters?: Json | null
          status?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_operations_log_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_upload_activity: {
        Row: {
          action_type: string
          bulk_upload_id: string
          bulk_upload_uuid: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          action_type: string
          bulk_upload_id: string
          bulk_upload_uuid?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
          workspace_id: string
        }
        Update: {
          action_type?: string
          bulk_upload_id?: string
          bulk_upload_uuid?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_upload_activity_bulk_upload_uuid_fkey"
            columns: ["bulk_upload_uuid"]
            isOneToOne: false
            referencedRelation: "bulk_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_upload_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_upload_approvals: {
        Row: {
          approver_id: string | null
          bulk_upload_id: string
          bulk_upload_uuid: string | null
          id: string
          metadata: Json | null
          notes: string | null
          requested_at: string | null
          requested_by: string
          reviewed_at: string | null
          status: string
          workspace_id: string
        }
        Insert: {
          approver_id?: string | null
          bulk_upload_id: string
          bulk_upload_uuid?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          requested_at?: string | null
          requested_by: string
          reviewed_at?: string | null
          status?: string
          workspace_id: string
        }
        Update: {
          approver_id?: string | null
          bulk_upload_id?: string
          bulk_upload_uuid?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          requested_at?: string | null
          requested_by?: string
          reviewed_at?: string | null
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_upload_approvals_bulk_upload_uuid_fkey"
            columns: ["bulk_upload_uuid"]
            isOneToOne: false
            referencedRelation: "bulk_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_upload_approvals_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_upload_comments: {
        Row: {
          bulk_upload_id: string
          bulk_upload_uuid: string | null
          comment_text: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          mentioned_users: string[] | null
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bulk_upload_id: string
          bulk_upload_uuid?: string | null
          comment_text: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          mentioned_users?: string[] | null
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bulk_upload_id?: string
          bulk_upload_uuid?: string | null
          comment_text?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          mentioned_users?: string[] | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_upload_comments_bulk_upload_uuid_fkey"
            columns: ["bulk_upload_uuid"]
            isOneToOne: false
            referencedRelation: "bulk_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_upload_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "bulk_upload_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_upload_notifications: {
        Row: {
          bulk_upload_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          user_id: string
        }
        Insert: {
          bulk_upload_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          user_id: string
        }
        Update: {
          bulk_upload_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_upload_notifications_bulk_upload_id_fkey"
            columns: ["bulk_upload_id"]
            isOneToOne: false
            referencedRelation: "bulk_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_upload_templates: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          domain: string
          id: string
          is_default: boolean | null
          is_shared: boolean | null
          name: string
          shared_with_workspace: boolean | null
          smart_options: Json | null
          updated_at: string | null
          utm_defaults: Json | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          domain: string
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name: string
          shared_with_workspace?: boolean | null
          smart_options?: Json | null
          updated_at?: string | null
          utm_defaults?: Json | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          domain?: string
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name?: string
          shared_with_workspace?: boolean | null
          smart_options?: Json | null
          updated_at?: string | null
          utm_defaults?: Json | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_upload_templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_uploads: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          failed_links: number | null
          id: string
          metadata: Json | null
          name: string | null
          status: string
          successful_links: number | null
          total_links: number | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          failed_links?: number | null
          id?: string
          metadata?: Json | null
          name?: string | null
          status?: string
          successful_links?: number | null
          total_links?: number | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          failed_links?: number | null
          id?: string
          metadata?: Json | null
          name?: string | null
          status?: string
          successful_links?: number | null
          total_links?: number | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_uploads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          id: string
          name: string
          status: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          status?: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_workspace_id_fkey"
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
          link_id: string | null
          metadata: Json | null
          user_identifier: string | null
          visitor_id: string | null
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
          link_id?: string | null
          metadata?: Json | null
          user_identifier?: string | null
          visitor_id?: string | null
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
          link_id?: string | null
          metadata?: Json | null
          user_identifier?: string | null
          visitor_id?: string | null
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
            referencedRelation: "hot_links_view"
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
      custom_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_scheduled: boolean | null
          report_config: Json
          report_name: string
          report_type: string
          schedule_frequency: string | null
          schedule_recipients: string[] | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_scheduled?: boolean | null
          report_config: Json
          report_name: string
          report_type: string
          schedule_frequency?: string | null
          schedule_recipients?: string[] | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_scheduled?: boolean | null
          report_config?: Json
          report_name?: string
          report_type?: string
          schedule_frequency?: string | null
          schedule_recipients?: string[] | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_reports_workspace_id_fkey"
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
      drip_campaign_schedules: {
        Row: {
          campaign_id: string
          condition_hours: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          trigger_condition: string | null
          trigger_hours: number | null
          trigger_milestone: string | null
          trigger_type: string
          trigger_value: number | null
        }
        Insert: {
          campaign_id: string
          condition_hours?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          trigger_condition?: string | null
          trigger_hours?: number | null
          trigger_milestone?: string | null
          trigger_type: string
          trigger_value?: number | null
        }
        Update: {
          campaign_id?: string
          condition_hours?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          trigger_condition?: string | null
          trigger_hours?: number | null
          trigger_milestone?: string | null
          trigger_type?: string
          trigger_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drip_campaign_schedules_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
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
          approval_timestamp: string | null
          badge: string | null
          company_domain: string | null
          country: string | null
          created_at: string | null
          desired_domain: string | null
          drip_emails_sent: Json | null
          email: string
          engagement_score: number | null
          fit_score: number | null
          fraud_risk_score: number | null
          how_heard: string | null
          id: string
          is_flagged: boolean | null
          last_activity_timestamp: string | null
          name: string
          position: number | null
          reason_details: string | null
          reason_for_joining: string | null
          referral_code: string | null
          referral_count: number | null
          referral_score: number | null
          referred_by: string | null
          role: string | null
          status: string | null
          team_size: string
          total_access_score: number | null
          unlocked_via_referral: boolean | null
          updated_at: string | null
          use_case_tags: string[] | null
        }
        Insert: {
          access_level?: number | null
          approval_timestamp?: string | null
          badge?: string | null
          company_domain?: string | null
          country?: string | null
          created_at?: string | null
          desired_domain?: string | null
          drip_emails_sent?: Json | null
          email: string
          engagement_score?: number | null
          fit_score?: number | null
          fraud_risk_score?: number | null
          how_heard?: string | null
          id?: string
          is_flagged?: boolean | null
          last_activity_timestamp?: string | null
          name: string
          position?: number | null
          reason_details?: string | null
          reason_for_joining?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referral_score?: number | null
          referred_by?: string | null
          role?: string | null
          status?: string | null
          team_size: string
          total_access_score?: number | null
          unlocked_via_referral?: boolean | null
          updated_at?: string | null
          use_case_tags?: string[] | null
        }
        Update: {
          access_level?: number | null
          approval_timestamp?: string | null
          badge?: string | null
          company_domain?: string | null
          country?: string | null
          created_at?: string | null
          desired_domain?: string | null
          drip_emails_sent?: Json | null
          email?: string
          engagement_score?: number | null
          fit_score?: number | null
          fraud_risk_score?: number | null
          how_heard?: string | null
          id?: string
          is_flagged?: boolean | null
          last_activity_timestamp?: string | null
          name?: string
          position?: number | null
          reason_details?: string | null
          reason_for_joining?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referral_score?: number | null
          referred_by?: string | null
          role?: string | null
          status?: string | null
          team_size?: string
          total_access_score?: number | null
          unlocked_via_referral?: boolean | null
          updated_at?: string | null
          use_case_tags?: string[] | null
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
      event_badge_scans: {
        Row: {
          company: string | null
          conversion_status: string | null
          created_at: string | null
          email: string
          event_id: string
          first_name: string | null
          id: string
          last_name: string | null
          scanned_at: string | null
          title: string | null
          visitor_id: string | null
        }
        Insert: {
          company?: string | null
          conversion_status?: string | null
          created_at?: string | null
          email: string
          event_id: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          scanned_at?: string | null
          title?: string | null
          visitor_id?: string | null
        }
        Update: {
          company?: string | null
          conversion_status?: string | null
          created_at?: string | null
          email?: string
          event_id?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          scanned_at?: string | null
          title?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_badge_scans_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "field_events"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          created_at: string | null
          created_by: string
          declared_at: string | null
          ended_at: string | null
          experiment_name: string
          id: string
          link_id: string
          probability_b_wins: number | null
          started_at: string | null
          status: string
          updated_at: string | null
          variant_a_clicks: number
          variant_a_conversions: number
          variant_a_label: string
          variant_a_url: string | null
          variant_b_clicks: number
          variant_b_conversions: number
          variant_b_label: string
          variant_b_url: string | null
          winner_variant: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          declared_at?: string | null
          ended_at?: string | null
          experiment_name: string
          id?: string
          link_id: string
          probability_b_wins?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          variant_a_clicks?: number
          variant_a_conversions?: number
          variant_a_label?: string
          variant_a_url?: string | null
          variant_b_clicks?: number
          variant_b_conversions?: number
          variant_b_label?: string
          variant_b_url?: string | null
          winner_variant?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          declared_at?: string | null
          ended_at?: string | null
          experiment_name?: string
          id?: string
          link_id?: string
          probability_b_wins?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          variant_a_clicks?: number
          variant_a_conversions?: number
          variant_a_label?: string
          variant_a_url?: string | null
          variant_b_clicks?: number
          variant_b_conversions?: number
          variant_b_label?: string
          variant_b_url?: string | null
          winner_variant?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "experiments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
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
      feature_flags_cache: {
        Row: {
          cache_data: Json | null
          cache_key: string
          created_at: string
          id: string
          invalidated_at: string | null
          updated_at: string
        }
        Insert: {
          cache_data?: Json | null
          cache_key: string
          created_at?: string
          id?: string
          invalidated_at?: string | null
          updated_at?: string
        }
        Update: {
          cache_data?: Json | null
          cache_key?: string
          created_at?: string
          id?: string
          invalidated_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feature_gates: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          min_plan_tier: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          min_plan_tier?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          min_plan_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_gates_min_plan_tier_fkey"
            columns: ["min_plan_tier"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          browser_info: Json | null
          category: string | null
          created_at: string | null
          id: string
          message: string
          page_url: string
          priority: string | null
          screenshot_url: string | null
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          category?: string | null
          created_at?: string | null
          id?: string
          message: string
          page_url: string
          priority?: string | null
          screenshot_url?: string | null
          status?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          category?: string | null
          created_at?: string | null
          id?: string
          message?: string
          page_url?: string
          priority?: string | null
          screenshot_url?: string | null
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      field_events: {
        Row: {
          attributed_pipeline: number | null
          attributed_revenue: number | null
          badge_imports: number | null
          baseline_visitors: number | null
          booth_link_id: string | null
          created_at: string | null
          created_by: string | null
          direct_scans: number | null
          end_date: string
          halo_visitors: number | null
          id: string
          lift_percentage: number | null
          location_city: string
          location_country: string
          name: string
          start_date: string
          status: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          attributed_pipeline?: number | null
          attributed_revenue?: number | null
          badge_imports?: number | null
          baseline_visitors?: number | null
          booth_link_id?: string | null
          created_at?: string | null
          created_by?: string | null
          direct_scans?: number | null
          end_date: string
          halo_visitors?: number | null
          id?: string
          lift_percentage?: number | null
          location_city: string
          location_country?: string
          name: string
          start_date: string
          status?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          attributed_pipeline?: number | null
          attributed_revenue?: number | null
          badge_imports?: number | null
          baseline_visitors?: number | null
          booth_link_id?: string | null
          created_at?: string | null
          created_by?: string | null
          direct_scans?: number | null
          end_date?: string
          halo_visitors?: number | null
          id?: string
          lift_percentage?: number | null
          location_city?: string
          location_country?: string
          name?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_events_booth_link_id_fkey"
            columns: ["booth_link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_events_booth_link_id_fkey"
            columns: ["booth_link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_events_booth_link_id_fkey"
            columns: ["booth_link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "field_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
      identity_edges: {
        Row: {
          confidence: number
          created_at: string
          id: string
          match_type: string
          signals: Json
          source_visitor_id: string
          target_visitor_id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          id?: string
          match_type?: string
          signals?: Json
          source_visitor_id: string
          target_visitor_id: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          id?: string
          match_type?: string
          signals?: Json
          source_visitor_id?: string
          target_visitor_id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_edges_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_name: string
          id: string
          imported_by: string | null
          matched_rows: number
          status: string
          total_rows: number
          unmatched_rows: number
          workspace_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_name: string
          id?: string
          imported_by?: string | null
          matched_rows?: number
          status?: string
          total_rows?: number
          unmatched_rows?: number
          workspace_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_name?: string
          id?: string
          imported_by?: string | null
          matched_rows?: number
          status?: string
          total_rows?: number
          unmatched_rows?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token_encrypted: string | null
          config_encrypted: string | null
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          refresh_token_encrypted: string | null
          workspace_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          config_encrypted?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          refresh_token_encrypted?: string | null
          workspace_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          config_encrypted?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          refresh_token_encrypted?: string | null
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
      journey_edges: {
        Row: {
          avg_transition_time_seconds: number | null
          conversion_impact_score: number | null
          created_at: string
          edge_confidence: number
          id: string
          is_discovered: boolean
          last_updated_at: string
          metadata: Json | null
          source_node_id: string
          target_node_id: string
          transition_count: number
          transition_probability: number
          workspace_id: string
        }
        Insert: {
          avg_transition_time_seconds?: number | null
          conversion_impact_score?: number | null
          created_at?: string
          edge_confidence?: number
          id?: string
          is_discovered?: boolean
          last_updated_at?: string
          metadata?: Json | null
          source_node_id: string
          target_node_id: string
          transition_count?: number
          transition_probability?: number
          workspace_id: string
        }
        Update: {
          avg_transition_time_seconds?: number | null
          conversion_impact_score?: number | null
          created_at?: string
          edge_confidence?: number
          id?: string
          is_discovered?: boolean
          last_updated_at?: string
          metadata?: Json | null
          source_node_id?: string
          target_node_id?: string
          transition_count?: number
          transition_probability?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "journey_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "journey_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_edges_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_events: {
        Row: {
          browser: string | null
          campaign: string | null
          city: string | null
          click_id: string | null
          content: string | null
          country: string | null
          created_at: string
          crm_deal_id: string | null
          currency: string | null
          deal_value: number | null
          device_type: string | null
          event_name: string | null
          event_type: string
          id: string
          landing_page: string | null
          link_id: string | null
          medium: string | null
          metadata: Json | null
          os: string | null
          referrer: string | null
          revenue: number | null
          source: string | null
          term: string | null
          user_id: string | null
          visitor_id: string
          workspace_id: string
        }
        Insert: {
          browser?: string | null
          campaign?: string | null
          city?: string | null
          click_id?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          crm_deal_id?: string | null
          currency?: string | null
          deal_value?: number | null
          device_type?: string | null
          event_name?: string | null
          event_type: string
          id?: string
          landing_page?: string | null
          link_id?: string | null
          medium?: string | null
          metadata?: Json | null
          os?: string | null
          referrer?: string | null
          revenue?: number | null
          source?: string | null
          term?: string | null
          user_id?: string | null
          visitor_id: string
          workspace_id: string
        }
        Update: {
          browser?: string | null
          campaign?: string | null
          city?: string | null
          click_id?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          crm_deal_id?: string | null
          currency?: string | null
          deal_value?: number | null
          device_type?: string | null
          event_name?: string | null
          event_type?: string
          id?: string
          landing_page?: string | null
          link_id?: string | null
          medium?: string | null
          metadata?: Json | null
          os?: string | null
          referrer?: string | null
          revenue?: number | null
          source?: string | null
          term?: string | null
          user_id?: string | null
          visitor_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_events_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "link_clicks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "journey_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_nodes: {
        Row: {
          avg_time_to_conversion_seconds: number | null
          conversion_probability: number | null
          created_at: string
          exit_probability: number | null
          expected_revenue: number | null
          id: string
          last_updated_at: string
          metadata: Json | null
          node_name: string
          node_type: string
          state_value: number | null
          traffic_volume: number | null
          workspace_id: string
        }
        Insert: {
          avg_time_to_conversion_seconds?: number | null
          conversion_probability?: number | null
          created_at?: string
          exit_probability?: number | null
          expected_revenue?: number | null
          id?: string
          last_updated_at?: string
          metadata?: Json | null
          node_name: string
          node_type: string
          state_value?: number | null
          traffic_volume?: number | null
          workspace_id: string
        }
        Update: {
          avg_time_to_conversion_seconds?: number | null
          conversion_probability?: number | null
          created_at?: string
          exit_probability?: number | null
          expected_revenue?: number | null
          id?: string
          last_updated_at?: string
          metadata?: Json | null
          node_name?: string
          node_type?: string
          state_value?: number | null
          traffic_volume?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_nodes_workspace_id_fkey"
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
      link_bandits: {
        Row: {
          a_matrix: Json
          b_vector: Json
          context_key: string
          conversions: number | null
          created_at: string | null
          destination_index: number
          id: string
          impressions: number | null
          last_updated_at: string | null
          link_id: string
        }
        Insert: {
          a_matrix?: Json
          b_vector?: Json
          context_key: string
          conversions?: number | null
          created_at?: string | null
          destination_index: number
          id?: string
          impressions?: number | null
          last_updated_at?: string | null
          link_id: string
        }
        Update: {
          a_matrix?: Json
          b_vector?: Json
          context_key?: string
          conversions?: number | null
          created_at?: string | null
          destination_index?: number
          id?: string
          impressions?: number | null
          last_updated_at?: string | null
          link_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_bandits_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_bandits_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_bandits_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
      }
      link_cache_metadata: {
        Row: {
          access_count: number | null
          cache_size_bytes: number | null
          cache_tier: string
          created_at: string | null
          id: string
          last_accessed_at: string | null
          link_id: string | null
          updated_at: string | null
        }
        Insert: {
          access_count?: number | null
          cache_size_bytes?: number | null
          cache_tier?: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          link_id?: string | null
          updated_at?: string | null
        }
        Update: {
          access_count?: number | null
          cache_size_bytes?: number | null
          cache_tier?: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          link_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_cache_metadata_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_cache_metadata_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_cache_metadata_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: true
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
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
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
          campaign_id: string | null
          city: string | null
          click_hour: number | null
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
          visitor_id: string | null
          workspace_id: string | null
        }
        Insert: {
          browser?: string | null
          campaign_id?: string | null
          city?: string | null
          click_hour?: number | null
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
          visitor_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          browser?: string | null
          campaign_id?: string | null
          city?: string | null
          click_hour?: number | null
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
          visitor_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "link_clicks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
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
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
      link_health_checks: {
        Row: {
          check_time: string | null
          error_message: string | null
          final_url: string | null
          id: string
          is_healthy: boolean | null
          link_id: string
          redirect_chain: string[] | null
          response_code: number | null
          response_time_ms: number | null
        }
        Insert: {
          check_time?: string | null
          error_message?: string | null
          final_url?: string | null
          id?: string
          is_healthy?: boolean | null
          link_id: string
          redirect_chain?: string[] | null
          response_code?: number | null
          response_time_ms?: number | null
        }
        Update: {
          check_time?: string | null
          error_message?: string | null
          final_url?: string | null
          id?: string
          is_healthy?: boolean | null
          link_id?: string
          redirect_chain?: string[] | null
          response_code?: number | null
          response_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_health_checks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_health_checks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_health_checks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
      }
      link_health_logs: {
        Row: {
          checked_at: string | null
          error_message: string | null
          final_url: string | null
          id: string
          is_healthy: boolean | null
          link_id: string
          redirect_chain: string[] | null
          response_time_ms: number | null
          status_code: number | null
        }
        Insert: {
          checked_at?: string | null
          error_message?: string | null
          final_url?: string | null
          id?: string
          is_healthy?: boolean | null
          link_id: string
          redirect_chain?: string[] | null
          response_time_ms?: number | null
          status_code?: number | null
        }
        Update: {
          checked_at?: string | null
          error_message?: string | null
          final_url?: string | null
          id?: string
          is_healthy?: boolean | null
          link_id?: string
          redirect_chain?: string[] | null
          response_time_ms?: number | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_health_logs_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_health_logs_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_health_logs_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
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
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
          color: string | null
          created_at: string | null
          created_by: string | null
          id: string
          link_id: string
          tag_name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          link_id: string
          tag_name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          link_id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_tags_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
          activation_at: string | null
          alert_last_sent_at: string | null
          alert_on_click: boolean | null
          approval_notes: string | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          blacklist_status: string | null
          cache_priority: string | null
          cache_score: number | null
          campaign_id: string | null
          clicks_last_hour: number | null
          content_analyzed_at: string | null
          content_description: string | null
          content_tags: string[] | null
          content_title: string | null
          contextual_routing: boolean | null
          conversion_rate: number | null
          created_at: string | null
          created_by: string
          custom_expiry_message: string | null
          deleted_at: string | null
          description: string | null
          destination_url: string
          destinations: Json | null
          domain: string
          duplicate_strategy: string | null
          expires_at: string | null
          fallback_url: string | null
          final_url: string
          folder_id: string | null
          geo_targets: Json | null
          health_check_failures: number | null
          health_status: string | null
          id: string
          is_ab_test: boolean | null
          last_cached_at: string | null
          last_clicked_at: string | null
          last_health_check: string | null
          link_type: string | null
          max_clicks: number | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          parent_link_id: string | null
          password_hash: string | null
          password_hint: string | null
          path: string
          pending_approval_by: string | null
          prospect_name: string | null
          redirect_type: string | null
          rejection_reason: string | null
          routing_strategy: string | null
          security_status: Database["public"]["Enums"]["security_status"] | null
          short_url: string | null
          slug: string
          smart_rotate: boolean | null
          status: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at: string | null
          title: string
          total_clicks: number | null
          total_conversions: number | null
          total_revenue: number | null
          traffic_score: number | null
          unique_clicks: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          version: number | null
          workspace_id: string
        }
        Insert: {
          ab_test_completed_at?: string | null
          ab_test_confidence_threshold?: number | null
          ab_test_min_clicks?: number | null
          ab_test_started_at?: string | null
          ab_test_status?: string | null
          ab_test_winner_id?: string | null
          activation_at?: string | null
          alert_last_sent_at?: string | null
          alert_on_click?: boolean | null
          approval_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          blacklist_status?: string | null
          cache_priority?: string | null
          cache_score?: number | null
          campaign_id?: string | null
          clicks_last_hour?: number | null
          content_analyzed_at?: string | null
          content_description?: string | null
          content_tags?: string[] | null
          content_title?: string | null
          contextual_routing?: boolean | null
          conversion_rate?: number | null
          created_at?: string | null
          created_by: string
          custom_expiry_message?: string | null
          deleted_at?: string | null
          description?: string | null
          destination_url: string
          destinations?: Json | null
          domain?: string
          duplicate_strategy?: string | null
          expires_at?: string | null
          fallback_url?: string | null
          final_url: string
          folder_id?: string | null
          geo_targets?: Json | null
          health_check_failures?: number | null
          health_status?: string | null
          id?: string
          is_ab_test?: boolean | null
          last_cached_at?: string | null
          last_clicked_at?: string | null
          last_health_check?: string | null
          link_type?: string | null
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          parent_link_id?: string | null
          password_hash?: string | null
          password_hint?: string | null
          path?: string
          pending_approval_by?: string | null
          prospect_name?: string | null
          redirect_type?: string | null
          rejection_reason?: string | null
          routing_strategy?: string | null
          security_status?:
            | Database["public"]["Enums"]["security_status"]
            | null
          short_url?: string | null
          slug: string
          smart_rotate?: boolean | null
          status?: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at?: string | null
          title: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_revenue?: number | null
          traffic_score?: number | null
          unique_clicks?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          version?: number | null
          workspace_id: string
        }
        Update: {
          ab_test_completed_at?: string | null
          ab_test_confidence_threshold?: number | null
          ab_test_min_clicks?: number | null
          ab_test_started_at?: string | null
          ab_test_status?: string | null
          ab_test_winner_id?: string | null
          activation_at?: string | null
          alert_last_sent_at?: string | null
          alert_on_click?: boolean | null
          approval_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          blacklist_status?: string | null
          cache_priority?: string | null
          cache_score?: number | null
          campaign_id?: string | null
          clicks_last_hour?: number | null
          content_analyzed_at?: string | null
          content_description?: string | null
          content_tags?: string[] | null
          content_title?: string | null
          contextual_routing?: boolean | null
          conversion_rate?: number | null
          created_at?: string | null
          created_by?: string
          custom_expiry_message?: string | null
          deleted_at?: string | null
          description?: string | null
          destination_url?: string
          destinations?: Json | null
          domain?: string
          duplicate_strategy?: string | null
          expires_at?: string | null
          fallback_url?: string | null
          final_url?: string
          folder_id?: string | null
          geo_targets?: Json | null
          health_check_failures?: number | null
          health_status?: string | null
          id?: string
          is_ab_test?: boolean | null
          last_cached_at?: string | null
          last_clicked_at?: string | null
          last_health_check?: string | null
          link_type?: string | null
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          parent_link_id?: string | null
          password_hash?: string | null
          password_hint?: string | null
          path?: string
          pending_approval_by?: string | null
          prospect_name?: string | null
          redirect_type?: string | null
          rejection_reason?: string | null
          routing_strategy?: string | null
          security_status?:
            | Database["public"]["Enums"]["security_status"]
            | null
          short_url?: string | null
          slug?: string
          smart_rotate?: boolean | null
          status?: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at?: string | null
          title?: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_revenue?: number | null
          traffic_score?: number | null
          unique_clicks?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          version?: number | null
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
            foreignKeyName: "links_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
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
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
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
      mfa_settings: {
        Row: {
          admin_recovery_codes_hashed: string[] | null
          backup_codes_downloaded: boolean | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_verified_at: string | null
          recovery_codes_hashed: string[] | null
          secret_encrypted: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_recovery_codes_hashed?: string[] | null
          backup_codes_downloaded?: boolean | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_verified_at?: string | null
          recovery_codes_hashed?: string[] | null
          secret_encrypted: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_recovery_codes_hashed?: string[] | null
          backup_codes_downloaded?: boolean | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_verified_at?: string | null
          recovery_codes_hashed?: string[] | null
          secret_encrypted?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      offline_conversions: {
        Row: {
          conversion_date: string
          created_at: string
          email: string
          id: string
          imported_by: string | null
          match_status: string
          matched_user_id: string | null
          matched_visitor_id: string | null
          metadata: Json | null
          revenue: number | null
          source_file: string | null
          workspace_id: string
        }
        Insert: {
          conversion_date: string
          created_at?: string
          email: string
          id?: string
          imported_by?: string | null
          match_status?: string
          matched_user_id?: string | null
          matched_visitor_id?: string | null
          metadata?: Json | null
          revenue?: number | null
          source_file?: string | null
          workspace_id: string
        }
        Update: {
          conversion_date?: string
          created_at?: string
          email?: string
          id?: string
          imported_by?: string | null
          match_status?: string
          matched_user_id?: string | null
          matched_visitor_id?: string | null
          metadata?: Json | null
          revenue?: number | null
          source_file?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offline_conversions_workspace_id_fkey"
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
            referencedRelation: "hot_links_view"
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
      pixel_configs: {
        Row: {
          created_at: string | null
          created_by: string
          domain_whitelist: string[] | null
          id: string
          is_active: boolean | null
          pixel_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          domain_whitelist?: string[] | null
          id?: string
          is_active?: boolean | null
          pixel_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          domain_whitelist?: string[] | null
          id?: string
          is_active?: boolean | null
          pixel_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pixel_configs_workspace_id_fkey"
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
          credit_months: number | null
          data_retention_days: number | null
          email: string
          email_open_count: number | null
          first_analytics_viewed_at: string | null
          first_link_created_at: string | null
          first_qr_generated_at: string | null
          full_name: string | null
          icp_role: string | null
          id: string
          is_super_admin: boolean | null
          mfa_challenge: string | null
          mfa_enforced: boolean | null
          mfa_verified_at: string | null
          onboarding_completed: boolean | null
          primary_use_case: string | null
          referred_by_code: string | null
          team_members_invited_count: number | null
          team_size: string | null
          tracking_consent: boolean | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          access_level?: number | null
          activation_score?: number | null
          avatar_url?: string | null
          created_at?: string | null
          credit_months?: number | null
          data_retention_days?: number | null
          email: string
          email_open_count?: number | null
          first_analytics_viewed_at?: string | null
          first_link_created_at?: string | null
          first_qr_generated_at?: string | null
          full_name?: string | null
          icp_role?: string | null
          id: string
          is_super_admin?: boolean | null
          mfa_challenge?: string | null
          mfa_enforced?: boolean | null
          mfa_verified_at?: string | null
          onboarding_completed?: boolean | null
          primary_use_case?: string | null
          referred_by_code?: string | null
          team_members_invited_count?: number | null
          team_size?: string | null
          tracking_consent?: boolean | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          access_level?: number | null
          activation_score?: number | null
          avatar_url?: string | null
          created_at?: string | null
          credit_months?: number | null
          data_retention_days?: number | null
          email?: string
          email_open_count?: number | null
          first_analytics_viewed_at?: string | null
          first_link_created_at?: string | null
          first_qr_generated_at?: string | null
          full_name?: string | null
          icp_role?: string | null
          id?: string
          is_super_admin?: boolean | null
          mfa_challenge?: string | null
          mfa_enforced?: boolean | null
          mfa_verified_at?: string | null
          onboarding_completed?: boolean | null
          primary_use_case?: string | null
          referred_by_code?: string | null
          team_members_invited_count?: number | null
          team_size?: string | null
          tracking_consent?: boolean | null
          updated_at?: string | null
          user_type?: string | null
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
            referencedRelation: "hot_links_view"
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
      rate_limit_tiers: {
        Row: {
          burst_multiplier: number
          business_tier_limit: number
          enterprise_tier_limit: number
          free_tier_limit: number
          id: string
          load_threshold_high: number
          load_threshold_low: number
          pro_tier_limit: number
          updated_at: string | null
        }
        Insert: {
          burst_multiplier?: number
          business_tier_limit?: number
          enterprise_tier_limit?: number
          free_tier_limit?: number
          id?: string
          load_threshold_high?: number
          load_threshold_low?: number
          pro_tier_limit?: number
          updated_at?: string | null
        }
        Update: {
          burst_multiplier?: number
          business_tier_limit?: number
          enterprise_tier_limit?: number
          free_tier_limit?: number
          id?: string
          load_threshold_high?: number
          load_threshold_low?: number
          pro_tier_limit?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      redirect_rules: {
        Row: {
          conditions: Json
          created_at: string | null
          created_by: string | null
          destination_url: string
          id: string
          is_active: boolean | null
          link_id: string | null
          match_count: number | null
          priority: number | null
          rule_name: string
          rule_type: string
          workspace_id: string
        }
        Insert: {
          conditions: Json
          created_at?: string | null
          created_by?: string | null
          destination_url: string
          id?: string
          is_active?: boolean | null
          link_id?: string | null
          match_count?: number | null
          priority?: number | null
          rule_name: string
          rule_type: string
          workspace_id: string
        }
        Update: {
          conditions?: Json
          created_at?: string | null
          created_by?: string | null
          destination_url?: string
          id?: string
          is_active?: boolean | null
          link_id?: string | null
          match_count?: number | null
          priority?: number | null
          rule_name?: string
          rule_type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redirect_rules_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redirect_rules_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redirect_rules_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "redirect_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      report_exports: {
        Row: {
          created_at: string | null
          created_by: string | null
          download_count: number | null
          expires_at: string | null
          export_format: string
          file_path: string | null
          id: string
          report_id: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          download_count?: number | null
          expires_at?: string | null
          export_format: string
          file_path?: string | null
          id?: string
          report_id?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          download_count?: number | null
          expires_at?: string | null
          export_format?: string
          file_path?: string | null
          id?: string
          report_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_exports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "custom_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_exports_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      role_capabilities: {
        Row: {
          capability: Database["public"]["Enums"]["workspace_capability"]
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          capability: Database["public"]["Enums"]["workspace_capability"]
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          capability?: Database["public"]["Enums"]["workspace_capability"]
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      sales_click_alerts: {
        Row: {
          click_metadata: Json | null
          created_at: string | null
          id: string
          link_id: string | null
          prospect_name: string | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          click_metadata?: Json | null
          created_at?: string | null
          id?: string
          link_id?: string | null
          prospect_name?: string | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          click_metadata?: Json | null
          created_at?: string | null
          id?: string
          link_id?: string | null
          prospect_name?: string | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_click_alerts_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_click_alerts_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_click_alerts_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
          },
        ]
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
      slack_channels: {
        Row: {
          channel_name: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          notification_types: string[] | null
          webhook_url_encrypted: string
          workspace_id: string
        }
        Insert: {
          channel_name: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notification_types?: string[] | null
          webhook_url_encrypted: string
          workspace_id: string
        }
        Update: {
          channel_name?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          notification_types?: string[] | null
          webhook_url_encrypted?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slack_channels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          id: string
          max_clicks_per_month: number | null
          max_custom_domains: number | null
          max_links: number | null
          price_monthly: number
          retention_days: number | null
          support_level: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          max_clicks_per_month?: number | null
          max_custom_domains?: number | null
          max_links?: number | null
          price_monthly: number
          retention_days?: number | null
          support_level?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_clicks_per_month?: number | null
          max_custom_domains?: number | null
          max_links?: number | null
          price_monthly?: number
          retention_days?: number | null
          support_level?: string | null
        }
        Relationships: []
      }
      system_load_metrics: {
        Row: {
          active_connections: number
          cpu_load_percent: number
          id: string
          memory_usage_percent: number
          recorded_at: string | null
          requests_per_second: number
        }
        Insert: {
          active_connections: number
          cpu_load_percent: number
          id?: string
          memory_usage_percent: number
          recorded_at?: string | null
          requests_per_second: number
        }
        Update: {
          active_connections?: number
          cpu_load_percent?: number
          id?: string
          memory_usage_percent?: number
          recorded_at?: string | null
          requests_per_second?: number
        }
        Relationships: []
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
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
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
      url_duplicate_config: {
        Row: {
          ab_test_mode: boolean | null
          archive_old: boolean | null
          auto_version: boolean | null
          compare_campaign: boolean | null
          compare_schedule: boolean | null
          compare_utm: boolean | null
          created_at: string | null
          id: string
          max_versions: number | null
          merge_analytics: boolean | null
          notify_on_duplicate: boolean | null
          smart_routing: boolean | null
          strategy: string
          suggest_alternatives: boolean | null
          track_lineage: boolean | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          ab_test_mode?: boolean | null
          archive_old?: boolean | null
          auto_version?: boolean | null
          compare_campaign?: boolean | null
          compare_schedule?: boolean | null
          compare_utm?: boolean | null
          created_at?: string | null
          id?: string
          max_versions?: number | null
          merge_analytics?: boolean | null
          notify_on_duplicate?: boolean | null
          smart_routing?: boolean | null
          strategy?: string
          suggest_alternatives?: boolean | null
          track_lineage?: boolean | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          ab_test_mode?: boolean | null
          archive_old?: boolean | null
          auto_version?: boolean | null
          compare_campaign?: boolean | null
          compare_schedule?: boolean | null
          compare_utm?: boolean | null
          created_at?: string | null
          id?: string
          max_versions?: number | null
          merge_analytics?: boolean | null
          notify_on_duplicate?: boolean | null
          smart_routing?: boolean | null
          strategy?: string
          suggest_alternatives?: boolean | null
          track_lineage?: boolean | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "url_duplicate_config_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_authenticators: {
        Row: {
          counter: number
          created_at: string
          credential_id: string
          device_name: string | null
          id: string
          last_used_at: string | null
          public_key: string
          registered_domain: string | null
          user_id: string
        }
        Insert: {
          counter?: number
          created_at?: string
          credential_id: string
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key: string
          registered_domain?: string | null
          user_id: string
        }
        Update: {
          counter?: number
          created_at?: string
          credential_id?: string
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key?: string
          registered_domain?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "waitlist_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "early_access_requests"
            referencedColumns: ["id"]
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
      visitor_identities: {
        Row: {
          created_at: string
          email: string
          id: string
          identified_at: string
          name: string | null
          updated_at: string
          visitor_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          identified_at?: string
          name?: string | null
          updated_at?: string
          visitor_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          identified_at?: string
          name?: string | null
          updated_at?: string
          visitor_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_identities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_badges: {
        Row: {
          badge_key: string
          color: string
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          points_required: number | null
          tier: string
        }
        Insert: {
          badge_key: string
          color: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          points_required?: number | null
          tier?: string
        }
        Update: {
          badge_key?: string
          color?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          points_required?: number | null
          tier?: string
        }
        Relationships: []
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
      waitlist_milestones: {
        Row: {
          achieved_at: string | null
          id: string
          metadata: Json | null
          milestone_type: string
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          id?: string
          metadata?: Json | null
          milestone_type: string
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          id?: string
          metadata?: Json | null
          milestone_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_milestones_user_id_fkey"
            columns: ["user_id"]
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
          secret_encrypted: string | null
          webhook_url: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          secret_encrypted?: string | null
          webhook_url: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          secret_encrypted?: string | null
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
      workspace_hygiene_notifications: {
        Row: {
          created_at: string | null
          dismissed: boolean | null
          dismissed_at: string | null
          id: string
          item_count: number
          item_ids: Json
          metadata: Json | null
          notification_type: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          item_count?: number
          item_ids?: Json
          metadata?: Json | null
          notification_type: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          item_count?: number
          item_ids?: Json
          metadata?: Json | null
          notification_type?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_hygiene_notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
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
      workspace_notification_settings: {
        Row: {
          anomaly_threshold: number | null
          created_at: string | null
          debounce_hours: number | null
          drop_alerts_enabled: boolean | null
          email_enabled: boolean | null
          email_recipients: string[] | null
          id: string
          new_source_alerts_enabled: boolean | null
          quiet_hours_end: number | null
          quiet_hours_start: number | null
          slack_enabled: boolean | null
          slack_webhook_url_encrypted: string | null
          spike_alerts_enabled: boolean | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          anomaly_threshold?: number | null
          created_at?: string | null
          debounce_hours?: number | null
          drop_alerts_enabled?: boolean | null
          email_enabled?: boolean | null
          email_recipients?: string[] | null
          id?: string
          new_source_alerts_enabled?: boolean | null
          quiet_hours_end?: number | null
          quiet_hours_start?: number | null
          slack_enabled?: boolean | null
          slack_webhook_url_encrypted?: string | null
          spike_alerts_enabled?: boolean | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          anomaly_threshold?: number | null
          created_at?: string | null
          debounce_hours?: number | null
          drop_alerts_enabled?: boolean | null
          email_enabled?: boolean | null
          email_recipients?: string[] | null
          id?: string
          new_source_alerts_enabled?: boolean | null
          quiet_hours_end?: number | null
          quiet_hours_start?: number | null
          slack_enabled?: boolean | null
          slack_webhook_url_encrypted?: string | null
          spike_alerts_enabled?: boolean | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_notification_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
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
          ga4_api_secret_encrypted: string | null
          ga4_measurement_id: string | null
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
          require_approval_for_contributors: boolean | null
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
          ga4_api_secret_encrypted?: string | null
          ga4_measurement_id?: string | null
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
          require_approval_for_contributors?: boolean | null
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
          ga4_api_secret_encrypted?: string | null
          ga4_measurement_id?: string | null
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
          require_approval_for_contributors?: boolean | null
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
      zapier_webhooks: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret_key: string | null
          target_url: string
          total_triggers: number | null
          trigger_type: string
          webhook_name: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret_key?: string | null
          target_url: string
          total_triggers?: number | null
          trigger_type: string
          webhook_name: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret_key?: string | null
          target_url?: string
          total_triggers?: number | null
          trigger_type?: string
          webhook_name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zapier_webhooks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      audit_statistics: {
        Row: {
          event_count: number | null
          event_type: string | null
          last_event_at: string | null
          unique_actors: number | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      hot_links_view: {
        Row: {
          ab_test_completed_at: string | null
          ab_test_confidence_threshold: number | null
          ab_test_min_clicks: number | null
          ab_test_started_at: string | null
          ab_test_status: string | null
          ab_test_winner_id: string | null
          activation_at: string | null
          approval_notes: string | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          blacklist_status: string | null
          cache_priority: string | null
          cache_score: number | null
          campaign_id: string | null
          clicks_last_hour: number | null
          contextual_routing: boolean | null
          conversion_rate: number | null
          created_at: string | null
          created_by: string | null
          custom_expiry_message: string | null
          deleted_at: string | null
          description: string | null
          destination_url: string | null
          destinations: Json | null
          domain: string | null
          duplicate_strategy: string | null
          expires_at: string | null
          fallback_url: string | null
          final_url: string | null
          folder_id: string | null
          geo_targets: Json | null
          health_check_failures: number | null
          health_status: string | null
          id: string | null
          is_ab_test: boolean | null
          last_cached_at: string | null
          last_clicked_at: string | null
          last_health_check: string | null
          max_clicks: number | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          parent_link_id: string | null
          password_hash: string | null
          password_hint: string | null
          path: string | null
          pending_approval_by: string | null
          redirect_type: string | null
          rejection_reason: string | null
          routing_strategy: string | null
          security_status: Database["public"]["Enums"]["security_status"] | null
          short_url: string | null
          slug: string | null
          smart_rotate: boolean | null
          status: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at: string | null
          title: string | null
          total_clicks: number | null
          total_conversions: number | null
          total_revenue: number | null
          traffic_score: number | null
          unique_clicks: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          version: number | null
          workspace_id: string | null
        }
        Insert: {
          ab_test_completed_at?: string | null
          ab_test_confidence_threshold?: number | null
          ab_test_min_clicks?: number | null
          ab_test_started_at?: string | null
          ab_test_status?: string | null
          ab_test_winner_id?: string | null
          activation_at?: string | null
          approval_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          blacklist_status?: string | null
          cache_priority?: string | null
          cache_score?: number | null
          campaign_id?: string | null
          clicks_last_hour?: number | null
          contextual_routing?: boolean | null
          conversion_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_expiry_message?: string | null
          deleted_at?: string | null
          description?: string | null
          destination_url?: string | null
          destinations?: Json | null
          domain?: string | null
          duplicate_strategy?: string | null
          expires_at?: string | null
          fallback_url?: string | null
          final_url?: string | null
          folder_id?: string | null
          geo_targets?: Json | null
          health_check_failures?: number | null
          health_status?: string | null
          id?: string | null
          is_ab_test?: boolean | null
          last_cached_at?: string | null
          last_clicked_at?: string | null
          last_health_check?: string | null
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          parent_link_id?: string | null
          password_hash?: string | null
          password_hint?: string | null
          path?: string | null
          pending_approval_by?: string | null
          redirect_type?: string | null
          rejection_reason?: string | null
          routing_strategy?: string | null
          security_status?:
            | Database["public"]["Enums"]["security_status"]
            | null
          short_url?: string | null
          slug?: string | null
          smart_rotate?: boolean | null
          status?: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at?: string | null
          title?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_revenue?: number | null
          traffic_score?: number | null
          unique_clicks?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          version?: number | null
          workspace_id?: string | null
        }
        Update: {
          ab_test_completed_at?: string | null
          ab_test_confidence_threshold?: number | null
          ab_test_min_clicks?: number | null
          ab_test_started_at?: string | null
          ab_test_status?: string | null
          ab_test_winner_id?: string | null
          activation_at?: string | null
          approval_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          blacklist_status?: string | null
          cache_priority?: string | null
          cache_score?: number | null
          campaign_id?: string | null
          clicks_last_hour?: number | null
          contextual_routing?: boolean | null
          conversion_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_expiry_message?: string | null
          deleted_at?: string | null
          description?: string | null
          destination_url?: string | null
          destinations?: Json | null
          domain?: string | null
          duplicate_strategy?: string | null
          expires_at?: string | null
          fallback_url?: string | null
          final_url?: string | null
          folder_id?: string | null
          geo_targets?: Json | null
          health_check_failures?: number | null
          health_status?: string | null
          id?: string | null
          is_ab_test?: boolean | null
          last_cached_at?: string | null
          last_clicked_at?: string | null
          last_health_check?: string | null
          max_clicks?: number | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          parent_link_id?: string | null
          password_hash?: string | null
          password_hint?: string | null
          path?: string | null
          pending_approval_by?: string | null
          redirect_type?: string | null
          rejection_reason?: string | null
          routing_strategy?: string | null
          security_status?:
            | Database["public"]["Enums"]["security_status"]
            | null
          short_url?: string | null
          slug?: string | null
          smart_rotate?: boolean | null
          status?: Database["public"]["Enums"]["link_status"] | null
          submitted_for_approval_at?: string | null
          title?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_revenue?: number | null
          traffic_score?: number | null
          unique_clicks?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          version?: number | null
          workspace_id?: string | null
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
            foreignKeyName: "links_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
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
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "hot_links_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "mv_click_time_series"
            referencedColumns: ["link_id"]
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
      calculate_cross_device_attribution: {
        Args: {
          p_end_date: string
          p_start_date: string
          p_workspace_id: string
        }
        Returns: {
          campaign: string
          credit: number
          cross_device_conversions: number
          medium: string
          source: string
          total_conversions: number
          total_revenue: number
        }[]
      }
      calculate_linear_attribution: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          campaign: string
          linear_credit: number
          medium: string
          source: string
          total_conversions: number
          total_revenue: number
        }[]
      }
      calculate_link_cache_score: {
        Args: { p_link_id: string }
        Returns: number
      }
      calculate_position_attribution: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          campaign: string
          medium: string
          position_credit: number
          source: string
          total_conversions: number
          total_revenue: number
        }[]
      }
      calculate_state_values: {
        Args: {
          p_convergence_threshold?: number
          p_conversion_reward?: number
          p_discount_factor?: number
          p_max_iterations?: number
          p_workspace_id: string
        }
        Returns: {
          conversion_probability: number
          next_best_action: string
          node_id: string
          node_name: string
          node_type: string
          state_value: number
        }[]
      }
      calculate_time_decay_attribution: {
        Args: {
          p_end_date?: string
          p_half_life_days?: number
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          campaign: string
          decay_credit: number
          medium: string
          source: string
          total_conversions: number
          total_revenue: number
        }[]
      }
      calculate_traffic_score: { Args: { p_link_id: string }; Returns: number }
      check_key_rotation: { Args: never; Returns: undefined }
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_ip_address: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_audit_velocity_tracking: { Args: never; Returns: undefined }
      decrypt_sensitive_data: {
        Args: { ciphertext: string; encryption_key: string }
        Returns: string
      }
      detect_stale_links: {
        Args: { p_workspace_id: string }
        Returns: {
          created_at: string
          last_clicked_at: string
          link_id: string
          short_url: string
          title: string
        }[]
      }
      discover_journey_structure: {
        Args: {
          p_lookback_days?: number
          p_min_transition_count?: number
          p_workspace_id: string
        }
        Returns: {
          edges_created: number
          edges_updated: number
          nodes_created: number
          nodes_updated: number
        }[]
      }
      encrypt_sensitive_data: {
        Args: { encryption_key: string; plaintext: string }
        Returns: string
      }
      find_pareto_optimal_paths: {
        Args: {
          p_end_node_type?: string
          p_max_path_length?: number
          p_start_node_type?: string
          p_workspace_id: string
        }
        Returns: {
          avg_probability: number
          efficiency_score: number
          is_pareto_optimal: boolean
          path_id: number
          path_node_ids: string[]
          path_nodes: string[]
          total_steps: number
          total_value: number
        }[]
      }
      generate_invite_token: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      generate_verification_code: { Args: never; Returns: string }
      get_channel_lift: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          baseline_conversions: number
          baseline_rate: number
          baseline_total: number
          channel: string
          lift_category: string
          lift_percent: number
          treatment_conversions: number
          treatment_rate: number
          treatment_total: number
        }[]
      }
      get_conversion_velocity: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          avg_days_to_convert: number
          bucket_1_7_days: number
          bucket_31_90_days: number
          bucket_8_30_days: number
          bucket_90_plus_days: number
          channel: string
          median_days_to_convert: number
          total_conversions: number
        }[]
      }
      get_customer_journey: {
        Args: { p_user_id: string; p_workspace_id: string }
        Returns: {
          campaign: string
          created_at: string
          device_type: string
          event_id: string
          event_name: string
          event_type: string
          landing_page: string
          medium: string
          referrer: string
          revenue: number
          source: string
        }[]
      }
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
      get_journey_flow: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          conversion_rate: number
          flow_value: number
          source_node: string
          target_node: string
        }[]
      }
      get_journey_graph: {
        Args: { p_min_confidence?: number; p_workspace_id: string }
        Returns: {
          edges: Json
          nodes: Json
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
      get_next_url_version: {
        Args: { p_destination_url: string; p_workspace_id: string }
        Returns: number
      }
      get_pipeline_funnel: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_workspace_id: string
        }
        Returns: {
          avg_value: number
          conversion_rate: number
          count: number
          stage: string
          total_value: number
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
      get_topic_attribution: {
        Args: { p_workspace_id: string }
        Returns: {
          conversions: number
          link_count: number
          topic: string
          total_revenue: number
        }[]
      }
      get_unified_visitor_journeys: {
        Args: { p_visitor_id: string; p_workspace_id: string }
        Returns: {
          confidence: number
          journey_visitor_id: string
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
      has_capability: {
        Args: {
          _capability: Database["public"]["Enums"]["workspace_capability"]
          _user_id: string
          _workspace_id: string
        }
        Returns: boolean
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
      increment_referral_count: {
        Args: { referrer_id: string }
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
      log_audit_event: {
        Args: {
          p_actor_id: string
          p_changes: Json
          p_event_type: string
          p_metadata: Json
          p_resource_id: string
          p_workspace_id: string
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
      log_workspace_action: {
        Args: {
          p_action: string
          p_admin_user_id: string
          p_ip_address?: string
          p_new_values?: Json
          p_old_values?: Json
          p_resource_id: string
          p_resource_type: string
          p_user_agent?: string
          p_workspace_id: string
        }
        Returns: string
      }
      recommend_role: {
        Args: {
          _required_capabilities: Database["public"]["Enums"]["workspace_capability"][]
        }
        Returns: {
          excess_capabilities: number
          matched_capabilities: number
          missing_capabilities: number
          recommended_role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      refresh_analytics_views: { Args: never; Returns: undefined }
      refresh_waitlist_analytics: { Args: never; Returns: undefined }
      requires_mfa_verification: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      stitch_visitor_identity: {
        Args: { p_user_id: string; p_visitor_id: string }
        Returns: number
      }
      update_link_cache_scores: { Args: never; Returns: undefined }
      update_traffic_scores: { Args: never; Returns: undefined }
      update_waitlist_positions: { Args: never; Returns: undefined }
      verify_api_key: {
        Args: {
          p_key_hash: string
          p_key_prefix: string
          p_workspace_id: string
        }
        Returns: {
          is_active: boolean
          key_id: string
          key_name: string
          rate_limit: number
          rate_limit_window: string
          requests_this_window: number
          scopes: string[]
          window_reset_at: string
          workspace_id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      link_status:
        | "active"
        | "paused"
        | "archived"
        | "scheduled"
        | "pending"
        | "rejected"
      plan_tier:
        | "free"
        | "starter"
        | "pro"
        | "business"
        | "enterprise"
        | "lifetime"
        | "growth"
      report_frequency: "daily" | "weekly" | "monthly" | "custom"
      report_template:
        | "weekly_summary"
        | "monthly_overview"
        | "campaign_performance"
      security_status: "safe" | "threats_detected" | "not_scanned" | "pending"
      user_role:
        | "super_admin"
        | "workspace_admin"
        | "editor"
        | "viewer"
        | "contributor"
      workspace_capability:
        | "can_view_billing"
        | "can_manage_billing"
        | "can_create_links"
        | "can_update_links"
        | "can_delete_links"
        | "can_view_analytics"
        | "can_export_analytics"
        | "can_invite_members"
        | "can_remove_members"
        | "can_manage_roles"
        | "can_manage_domains"
        | "can_manage_integrations"
        | "can_manage_webhooks"
        | "can_create_qr"
        | "can_manage_campaigns"
        | "can_view_audit_logs"
        | "can_manage_workspace_settings"
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
      link_status: [
        "active",
        "paused",
        "archived",
        "scheduled",
        "pending",
        "rejected",
      ],
      plan_tier: [
        "free",
        "starter",
        "pro",
        "business",
        "enterprise",
        "lifetime",
        "growth",
      ],
      report_frequency: ["daily", "weekly", "monthly", "custom"],
      report_template: [
        "weekly_summary",
        "monthly_overview",
        "campaign_performance",
      ],
      security_status: ["safe", "threats_detected", "not_scanned", "pending"],
      user_role: [
        "super_admin",
        "workspace_admin",
        "editor",
        "viewer",
        "contributor",
      ],
      workspace_capability: [
        "can_view_billing",
        "can_manage_billing",
        "can_create_links",
        "can_update_links",
        "can_delete_links",
        "can_view_analytics",
        "can_export_analytics",
        "can_invite_members",
        "can_remove_members",
        "can_manage_roles",
        "can_manage_domains",
        "can_manage_integrations",
        "can_manage_webhooks",
        "can_create_qr",
        "can_manage_campaigns",
        "can_view_audit_logs",
        "can_manage_workspace_settings",
      ],
    },
  },
} as const
