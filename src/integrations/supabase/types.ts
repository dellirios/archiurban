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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          sender_id: string
          sender_name: string
          sender_role: string
          tenant_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          sender_id: string
          sender_name: string
          sender_role?: string
          tenant_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_invites: {
        Row: {
          accepted_at: string | null
          client_name: string
          created_at: string
          email: string
          id: string
          invited_by: string | null
          project_ids: string[] | null
          status: string
          tenant_id: string
        }
        Insert: {
          accepted_at?: string | null
          client_name: string
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          project_ids?: string[] | null
          status?: string
          tenant_id: string
        }
        Update: {
          accepted_at?: string | null
          client_name?: string
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          project_ids?: string[] | null
          status?: string
          tenant_id?: string
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          created_at: string
          email: string | null
          estimated_value: number | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          origin: string | null
          phone: string | null
          stage: string
          temperature: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          origin?: string | null
          phone?: string | null
          stage?: string
          temperature?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          estimated_value?: number | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          origin?: string | null
          phone?: string | null
          stage?: string
          temperature?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_interactions: {
        Row: {
          content: string
          created_at: string
          created_by: string
          created_by_id: string | null
          id: string
          lead_id: string
          tenant_id: string
          type: string
        }
        Insert: {
          content?: string
          created_at?: string
          created_by?: string
          created_by_id?: string | null
          id?: string
          lead_id: string
          tenant_id: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          created_by_id?: string | null
          id?: string
          lead_id?: string
          tenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          reference_id: string | null
          reference_type: string | null
          tenant_id: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          reference_id?: string | null
          reference_type?: string | null
          tenant_id: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          reference_id?: string | null
          reference_type?: string | null
          tenant_id?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          role: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          job_title?: string | null
          phone?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string
          folder: string
          id: string
          name: string
          project_id: string
          storage_path: string
          tenant_id: string
          uploaded_by: string
          uploaded_by_id: string | null
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string
          folder?: string
          id?: string
          name: string
          project_id: string
          storage_path: string
          tenant_id: string
          uploaded_by?: string
          uploaded_by_id?: string | null
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string
          folder?: string
          id?: string
          name?: string
          project_id?: string
          storage_path?: string
          tenant_id?: string
          uploaded_by?: string
          uploaded_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_email: string | null
          client_name: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_portfolio_public: boolean
          name: string
          photos: Json | null
          priority: string
          progress: number
          stages: Json | null
          start_date: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_email?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_portfolio_public?: boolean
          name: string
          photos?: Json | null
          priority?: string
          progress?: number
          stages?: Json | null
          start_date?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_email?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_portfolio_public?: boolean
          name?: string
          photos?: Json | null
          priority?: string
          progress?: number
          stages?: Json | null
          start_date?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requisitions: {
        Row: {
          created_at: string
          id: string
          material: string
          notes: string | null
          project_id: string | null
          project_name: string
          quantity: number
          req_id: string
          status: string
          supplier: string
          tenant_id: string
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          material: string
          notes?: string | null
          project_id?: string | null
          project_name?: string
          quantity?: number
          req_id?: string
          status?: string
          supplier?: string
          tenant_id: string
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          material?: string
          notes?: string | null
          project_id?: string | null
          project_name?: string
          quantity?: number
          req_id?: string
          status?: string
          supplier?: string
          tenant_id?: string
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          active: boolean
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          tenant_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: string
          tenant_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          community: boolean
          content: Json | null
          created_at: string
          created_by: string | null
          created_by_id: string | null
          description: string | null
          icon: string | null
          id: string
          tenant_id: string
          title: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category?: string
          community?: boolean
          content?: Json | null
          created_at?: string
          created_by?: string | null
          created_by_id?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          tenant_id: string
          title: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          community?: boolean
          content?: Json | null
          created_at?: string
          created_by?: string | null
          created_by_id?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          tenant_id?: string
          title?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      tenants: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          instagram: string | null
          linkedin: string | null
          logo: string | null
          name: string
          primary_color: string | null
          slug: string | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          instagram?: string | null
          linkedin?: string | null
          logo?: string | null
          name: string
          primary_color?: string | null
          slug?: string | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          logo?: string | null
          name?: string
          primary_color?: string | null
          slug?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
    }
    Enums: {
      access_level: "viewer" | "editor" | "manager" | "admin"
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
      access_level: ["viewer", "editor", "manager", "admin"],
    },
  },
} as const
