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
      analytics_data_backup: {
        Row: {
          Ad_Unit: string | null
          Adsense_Revenue: number | null
          adsense_revenue_norm: number | null
          Browser: string | null
          Clicks: number | null
          Content_Author: string | null
          Content_Methodology: string | null
          Country: string | null
          Date: string | null
          Device: string | null
          Direct_Impressions: number | null
          Direct_Revenue: number | null
          direct_revenue_norm: number | null
          Domain: string | null
          Dynamic_Allocation_Revenue: number | null
          dynamic_allocation_revenue_norm: number | null
          GAM_Order: string | null
          iab_category: string | null
          id: number | null
          Impressions: number | null
          keywords: Json | null
          Nativo_Revenue: number | null
          nativo_revenue_norm: number | null
          Operating_System: string | null
          Outbrain_Revenue: number | null
          outbrain_revenue_norm: number | null
          Page_Type: string | null
          Page_Views: number | null
          Path: string | null
          Prebid_Won_Revenue: number | null
          prebid_won_revenue_norm: number | null
          Referrer_Type: string | null
          sentiment_polarity: number | null
          sentiment_subjectivity: number | null
          Size: string | null
          Taboola_Revenue: number | null
          taboola_revenue_norm: number | null
          Unfilled: number | null
          URL: string | null
          Viewable: number | null
          Viewable_Measureable_Impressions: number | null
          virality_score: number | null
          Yahoo_Gemini_Revenue: number | null
          yahoo_gemini_revenue_norm: number | null
        }
        Insert: {
          Ad_Unit?: string | null
          Adsense_Revenue?: number | null
          adsense_revenue_norm?: number | null
          Browser?: string | null
          Clicks?: number | null
          Content_Author?: string | null
          Content_Methodology?: string | null
          Country?: string | null
          Date?: string | null
          Device?: string | null
          Direct_Impressions?: number | null
          Direct_Revenue?: number | null
          direct_revenue_norm?: number | null
          Domain?: string | null
          Dynamic_Allocation_Revenue?: number | null
          dynamic_allocation_revenue_norm?: number | null
          GAM_Order?: string | null
          iab_category?: string | null
          id?: number | null
          Impressions?: number | null
          keywords?: Json | null
          Nativo_Revenue?: number | null
          nativo_revenue_norm?: number | null
          Operating_System?: string | null
          Outbrain_Revenue?: number | null
          outbrain_revenue_norm?: number | null
          Page_Type?: string | null
          Page_Views?: number | null
          Path?: string | null
          Prebid_Won_Revenue?: number | null
          prebid_won_revenue_norm?: number | null
          Referrer_Type?: string | null
          sentiment_polarity?: number | null
          sentiment_subjectivity?: number | null
          Size?: string | null
          Taboola_Revenue?: number | null
          taboola_revenue_norm?: number | null
          Unfilled?: number | null
          URL?: string | null
          Viewable?: number | null
          Viewable_Measureable_Impressions?: number | null
          virality_score?: number | null
          Yahoo_Gemini_Revenue?: number | null
          yahoo_gemini_revenue_norm?: number | null
        }
        Update: {
          Ad_Unit?: string | null
          Adsense_Revenue?: number | null
          adsense_revenue_norm?: number | null
          Browser?: string | null
          Clicks?: number | null
          Content_Author?: string | null
          Content_Methodology?: string | null
          Country?: string | null
          Date?: string | null
          Device?: string | null
          Direct_Impressions?: number | null
          Direct_Revenue?: number | null
          direct_revenue_norm?: number | null
          Domain?: string | null
          Dynamic_Allocation_Revenue?: number | null
          dynamic_allocation_revenue_norm?: number | null
          GAM_Order?: string | null
          iab_category?: string | null
          id?: number | null
          Impressions?: number | null
          keywords?: Json | null
          Nativo_Revenue?: number | null
          nativo_revenue_norm?: number | null
          Operating_System?: string | null
          Outbrain_Revenue?: number | null
          outbrain_revenue_norm?: number | null
          Page_Type?: string | null
          Page_Views?: number | null
          Path?: string | null
          Prebid_Won_Revenue?: number | null
          prebid_won_revenue_norm?: number | null
          Referrer_Type?: string | null
          sentiment_polarity?: number | null
          sentiment_subjectivity?: number | null
          Size?: string | null
          Taboola_Revenue?: number | null
          taboola_revenue_norm?: number | null
          Unfilled?: number | null
          URL?: string | null
          Viewable?: number | null
          Viewable_Measureable_Impressions?: number | null
          virality_score?: number | null
          Yahoo_Gemini_Revenue?: number | null
          yahoo_gemini_revenue_norm?: number | null
        }
        Relationships: []
      }
      analytics_processed: {
        Row: {
          id: string
          metrics: Json | null
          processed_at: string | null
          processing_completed_at: string | null
          processing_error: string | null
          processing_started_at: string | null
          processing_status: string | null
          time_series: Json | null
          url: string
        }
        Insert: {
          id?: string
          metrics?: Json | null
          processed_at?: string | null
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          processing_status?: string | null
          time_series?: Json | null
          url: string
        }
        Update: {
          id?: string
          metrics?: Json | null
          processed_at?: string | null
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          processing_status?: string | null
          time_series?: Json | null
          url?: string
        }
        Relationships: []
      }
      analytics_raw: {
        Row: {
          created_at: string | null
          id: string
          processed: boolean | null
          raw_data: Json | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed?: boolean | null
          raw_data?: Json | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed?: boolean | null
          raw_data?: Json | null
          url?: string
        }
        Relationships: []
      }
      asset_migrations: {
        Row: {
          asset_id: string | null
          attempt_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          migration_attempt: number | null
          new_url: string | null
          old_url: string | null
          status: Database["public"]["Enums"]["migration_status"] | null
          story_id: string | null
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          attempt_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          migration_attempt?: number | null
          new_url?: string | null
          old_url?: string | null
          status?: Database["public"]["Enums"]["migration_status"] | null
          story_id?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          attempt_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          migration_attempt?: number | null
          new_url?: string | null
          old_url?: string | null
          status?: Database["public"]["Enums"]["migration_status"] | null
          story_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_migrations_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "story_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_migrations_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "migration_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_migrations_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      attempts: {
        Row: {
          application: string | null
          attrs: Json | null
          created: string | null
          customer: string | null
          id: string | null
          on_behalf_of: string | null
          payment_method: string | null
          setup_intent: string | null
          status: string | null
          usage: string | null
        }
        Insert: {
          application?: string | null
          attrs?: Json | null
          created?: string | null
          customer?: string | null
          id?: string | null
          on_behalf_of?: string | null
          payment_method?: string | null
          setup_intent?: string | null
          status?: string | null
          usage?: string | null
        }
        Update: {
          application?: string | null
          attrs?: Json | null
          created?: string | null
          customer?: string | null
          id?: string | null
          on_behalf_of?: string | null
          payment_method?: string | null
          setup_intent?: string | null
          status?: string | null
          usage?: string | null
        }
        Relationships: []
      }
      background_story_jobs: {
        Row: {
          created_at: string
          error: string | null
          id: string
          result: Json | null
          settings: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          result?: Json | null
          settings: Json
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          result?: Json | null
          settings?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout: {
        Row: {
          attrs: Json | null
          customer: string | null
          id: string | null
          payment_intent: string | null
          subscription: string | null
        }
        Insert: {
          attrs?: Json | null
          customer?: string | null
          id?: string | null
          payment_intent?: string | null
          subscription?: string | null
        }
        Update: {
          attrs?: Json | null
          customer?: string | null
          id?: string | null
          payment_intent?: string | null
          subscription?: string | null
        }
        Relationships: []
      }
      child_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          birthday: string | null
          created_at: string | null
          favorite_themes: Json | null
          id: string
          name: string
          parent_id: string | null
          preferences: Json | null
          reading_level: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          birthday?: string | null
          created_at?: string | null
          favorite_themes?: Json | null
          id?: string
          name: string
          parent_id?: string | null
          preferences?: Json | null
          reading_level?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          birthday?: string | null
          created_at?: string | null
          favorite_themes?: Json | null
          id?: string
          name?: string
          parent_id?: string | null
          preferences?: Json | null
          reading_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          attrs: Json | null
          created: string | null
          description: string | null
          email: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          attrs?: Json | null
          created?: string | null
          description?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          attrs?: Json | null
          created?: string | null
          description?: string | null
          email?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      engagement: {
        Row: {
          engagement_type: string
          id: string
          page_id: string | null
          timestamp: string | null
          value: number
        }
        Insert: {
          engagement_type: string
          id?: string
          page_id?: string | null
          timestamp?: string | null
          value: number
        }
        Update: {
          engagement_type?: string
          id?: string
          page_id?: string | null
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "engagement_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_codes: {
        Row: {
          code: string
          created_at: string
          duration_months: number
          expires_at: string | null
          id: string
          purchaser_id: string | null
          recipient_email: string | null
          recipient_message: string | null
          redeemed_at: string | null
          redeemed_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          duration_months: number
          expires_at?: string | null
          id?: string
          purchaser_id?: string | null
          recipient_email?: string | null
          recipient_message?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          duration_months?: number
          expires_at?: string | null
          id?: string
          purchaser_id?: string | null
          recipient_email?: string | null
          recipient_message?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
        }
        Relationships: []
      }
      metrics: {
        Row: {
          id: string
          metric_type: string
          percentage_change: number | null
          timestamp: string | null
          value: number
        }
        Insert: {
          id?: string
          metric_type: string
          percentage_change?: number | null
          timestamp?: string | null
          value: number
        }
        Update: {
          id?: string
          metric_type?: string
          percentage_change?: number | null
          timestamp?: string | null
          value?: number
        }
        Relationships: []
      }
      migration_attempts: {
        Row: {
          assets_processed: number | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["migration_status"] | null
          story_id: string | null
          total_assets: number | null
        }
        Insert: {
          assets_processed?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["migration_status"] | null
          story_id?: string | null
          total_assets?: number | null
        }
        Update: {
          assets_processed?: number | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["migration_status"] | null
          story_id?: string | null
          total_assets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_attempts_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      page_metrics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          impressions: number | null
          page_views: number | null
          revenue: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          impressions?: number | null
          page_views?: number | null
          revenue?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          impressions?: number | null
          page_views?: number | null
          revenue?: number | null
          url?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          created_at: string | null
          description: string | null
          iab_category: string | null
          id: string
          impressions: number | null
          keywords: string[] | null
          revenue: number | null
          rpm: number | null
          sentiment: number | null
          title: string
          url: string
          views: number | null
          virality_score: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          iab_category?: string | null
          id?: string
          impressions?: number | null
          keywords?: string[] | null
          revenue?: number | null
          rpm?: number | null
          sentiment?: number | null
          title: string
          url: string
          views?: number | null
          virality_score?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          iab_category?: string | null
          id?: string
          impressions?: number | null
          keywords?: string[] | null
          revenue?: number | null
          rpm?: number | null
          sentiment?: number | null
          title?: string
          url?: string
          views?: number | null
          virality_score?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          attrs: Json | null
          created: string | null
          default_price: string | null
          description: string | null
          id: string | null
          name: string | null
          updated: string | null
        }
        Insert: {
          active?: boolean | null
          attrs?: Json | null
          created?: string | null
          default_price?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          updated?: string | null
        }
        Update: {
          active?: boolean | null
          attrs?: Json | null
          created?: string | null
          default_price?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          updated?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          child_age: string | null
          child_gender: string | null
          created_at: string
          credits: number | null
          daily_credits_used: number | null
          default_story_settings: Json | null
          full_name: string | null
          id: string
          last_reset_date: string | null
          max_free_stories: number | null
          notifications_enabled: boolean | null
          passcode: string | null
          renewal_date: string | null
          stories_created: number | null
          subscription_plan: string | null
          subscription_status: string | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          child_age?: string | null
          child_gender?: string | null
          created_at?: string
          credits?: number | null
          daily_credits_used?: number | null
          default_story_settings?: Json | null
          full_name?: string | null
          id: string
          last_reset_date?: string | null
          max_free_stories?: number | null
          notifications_enabled?: boolean | null
          passcode?: string | null
          renewal_date?: string | null
          stories_created?: number | null
          subscription_plan?: string | null
          subscription_status?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          child_age?: string | null
          child_gender?: string | null
          created_at?: string
          credits?: number | null
          daily_credits_used?: number | null
          default_story_settings?: Json | null
          full_name?: string | null
          id?: string
          last_reset_date?: string | null
          max_free_stories?: number | null
          notifications_enabled?: boolean | null
          passcode?: string | null
          renewal_date?: string | null
          stories_created?: number | null
          subscription_plan?: string | null
          subscription_status?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          age_range: Json | null
          assets_migrated: boolean | null
          bookmark_count: number | null
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          ip_address: string | null
          is_published: boolean | null
          migration_error: string | null
          moral_lessons: Json | null
          popularity_score: number | null
          reading_time_minutes: number | null
          search_vector: unknown | null
          settings: Json | null
          themes: Json | null
          title: string
          updated_at: string
          user_id: string | null
          view_count: number | null
          visual_context: Json | null
          visual_version: number | null
        }
        Insert: {
          age_range?: Json | null
          assets_migrated?: boolean | null
          bookmark_count?: number | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          is_published?: boolean | null
          migration_error?: string | null
          moral_lessons?: Json | null
          popularity_score?: number | null
          reading_time_minutes?: number | null
          search_vector?: unknown | null
          settings?: Json | null
          themes?: Json | null
          title: string
          updated_at?: string
          user_id?: string | null
          view_count?: number | null
          visual_context?: Json | null
          visual_version?: number | null
        }
        Update: {
          age_range?: Json | null
          assets_migrated?: boolean | null
          bookmark_count?: number | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          is_published?: boolean | null
          migration_error?: string | null
          moral_lessons?: Json | null
          popularity_score?: number | null
          reading_time_minutes?: number | null
          search_vector?: unknown | null
          settings?: Json | null
          themes?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
          view_count?: number | null
          visual_context?: Json | null
          visual_version?: number | null
        }
        Relationships: []
      }
      story_assets: {
        Row: {
          asset_status: string
          asset_type: Database["public"]["Enums"]["story_asset_type"]
          asset_url: string
          created_at: string
          id: string
          original_prompt: string | null
          page_number: number | null
          story_id: string | null
          updated_at: string | null
          word_timings: Json | null
        }
        Insert: {
          asset_status?: string
          asset_type: Database["public"]["Enums"]["story_asset_type"]
          asset_url: string
          created_at?: string
          id?: string
          original_prompt?: string | null
          page_number?: number | null
          story_id?: string | null
          updated_at?: string | null
          word_timings?: Json | null
        }
        Update: {
          asset_status?: string
          asset_type?: Database["public"]["Enums"]["story_asset_type"]
          asset_url?: string
          created_at?: string
          id?: string
          original_prompt?: string | null
          page_number?: number | null
          story_id?: string | null
          updated_at?: string | null
          word_timings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "story_assets_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_pages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          page_number: number
          story_id: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          page_number: number
          story_id?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          page_number?: number
          story_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe: {
        Row: {
          attrs: Json | null
          business_type: string | null
          country: string | null
          created: string | null
          email: string | null
          id: string | null
          type: string | null
        }
        Insert: {
          attrs?: Json | null
          business_type?: string | null
          country?: string | null
          created?: string | null
          email?: string | null
          id?: string | null
          type?: string | null
        }
        Update: {
          attrs?: Json | null
          business_type?: string | null
          country?: string | null
          created?: string | null
          email?: string | null
          id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          last_active: string | null
          session_count: number | null
          total_engagement_time: number | null
        }
        Insert: {
          id?: string
          last_active?: string | null
          session_count?: number | null
          total_engagement_time?: number | null
        }
        Update: {
          id?: string
          last_active?: string | null
          session_count?: number | null
          total_engagement_time?: number | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          id: string
          title: string
          transcript: string[] | null
          type: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          transcript?: string[] | null
          type: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          transcript?: string[] | null
          type?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_metrics: {
        Row: {
          avg_value: number | null
          data_points: number | null
          day: string | null
          metric_type: string | null
          total_value: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_rpm: {
        Args: { revenue: number; impressions: number }
        Returns: number
      }
      decrement_user_credits: {
        Args: Record<PropertyKey, never>
        Returns: {
          credits: number
        }[]
      }
      ensure_storage_bucket_config: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      extract_keywords: {
        Args: { text_content: string }
        Returns: {
          keyword: string
          score: number
        }[]
      }
      get_child_story_recommendations: {
        Args: { child_id: string; limit_param?: number }
        Returns: {
          id: string
          title: string
          cover_image_url: string
          relevance_score: number
        }[]
      }
      get_published_stories_with_assets: {
        Args: Record<PropertyKey, never>
        Returns: {
          story_id: string
          title: string
          asset_type: string
        }[]
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      increment_story_view_count: {
        Args: { story_id_param: string }
        Returns: undefined
      }
      jsonb_array_to_string: {
        Args: { arr: Json; delimiter: string }
        Returns: string
      }
      migrate_story_pages: {
        Args: Record<PropertyKey, never>
        Returns: {
          story_id: string
          status: string
          message: string
          pages_migrated: number
        }[]
      }
      process_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_story_migration: {
        Args: { story_id_param: string }
        Returns: {
          success: boolean
          message: string
          pages_processed: number
        }[]
      }
      search_stories: {
        Args: {
          search_query?: string
          age_min?: number
          age_max?: number
          theme_filter?: string[]
          moral_filter?: string[]
          min_length?: number
          max_length?: number
          limit_param?: number
        }
        Returns: {
          id: string
          title: string
          cover_image_url: string
          age_range: Json
          themes: Json
          moral_lessons: Json
          reading_time_minutes: number
          rank: number
        }[]
      }
      search_stories_with_arrays: {
        Args: {
          search_query?: string
          age_min?: number
          age_max?: number
          theme_filter?: string[]
          moral_filter?: string[]
          min_length?: number
          max_length?: number
          limit_param?: number
        }
        Returns: {
          id: string
          title: string
          cover_image_url: string
          age_range: Json
          themes: Json
          moral_lessons: Json
          reading_time_minutes: number
          rank: number
        }[]
      }
    }
    Enums: {
      migration_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "failed"
        | "rolled_back"
      story_asset_type: "audio" | "image"
      user_role: "admin" | "user"
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
      migration_status: [
        "pending",
        "in_progress",
        "completed",
        "failed",
        "rolled_back",
      ],
      story_asset_type: ["audio", "image"],
      user_role: ["admin", "user"],
    },
  },
} as const
