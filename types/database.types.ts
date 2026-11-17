export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          education_level: string | null;
          field_of_study: string | null;
          target_career: string | null;
          preferred_language: string;
          skills: Json;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          education_level?: string | null;
          field_of_study?: string | null;
          target_career?: string | null;
          preferred_language?: string;
          skills?: Json;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          education_level?: string | null;
          field_of_study?: string | null;
          target_career?: string | null;
          preferred_language?: string;
          skills?: Json;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_sessions: {
        Row: {
          id: string;
          user_id: string;
          module: 'learn' | 'path' | 'career' | 'marketplace';
          title: string;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module: 'learn' | 'path' | 'career' | 'marketplace';
          title: string;
          content?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module?: 'learn' | 'path' | 'career' | 'marketplace';
          title?: string;
          content?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
