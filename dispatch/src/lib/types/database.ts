export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          title: string
          description: string | null
          prompt_body: string
          category: string | null
          tags: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          title: string
          description?: string | null
          prompt_body: string
          category?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          title?: string
          description?: string | null
          prompt_body?: string
          category?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      context_assets: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          title: string
          description: string | null
          content: string
          asset_type: string | null
          tags: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          title: string
          description?: string | null
          content: string
          asset_type?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          title?: string
          description?: string | null
          content?: string
          asset_type?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          name: string
          description: string | null
          purpose: string | null
          platform: string | null
          setup_notes: string | null
          tags: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          name: string
          description?: string | null
          purpose?: string | null
          platform?: string | null
          setup_notes?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          name?: string
          description?: string | null
          purpose?: string | null
          platform?: string | null
          setup_notes?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          title: string
          description: string | null
          steps: Json
          tags: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          title: string
          description?: string | null
          steps?: Json
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          title?: string
          description?: string | null
          steps?: Json
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      workflow_prompts: {
        Row: {
          id: string
          workflow_id: string
          prompt_id: string
        }
        Insert: {
          id?: string
          workflow_id: string
          prompt_id: string
        }
        Update: {
          id?: string
          workflow_id?: string
          prompt_id?: string
        }
      }
      workflow_context_assets: {
        Row: {
          id: string
          workflow_id: string
          context_asset_id: string
        }
        Insert: {
          id?: string
          workflow_id: string
          context_asset_id: string
        }
        Update: {
          id?: string
          workflow_id?: string
          context_asset_id?: string
        }
      }
      workflow_agents: {
        Row: {
          id: string
          workflow_id: string
          agent_id: string
        }
        Insert: {
          id?: string
          workflow_id: string
          agent_id: string
        }
        Update: {
          id?: string
          workflow_id?: string
          agent_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
