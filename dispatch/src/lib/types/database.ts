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
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
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
          sample_output_path: string | null
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
          sample_output_path?: string | null
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
          sample_output_path?: string | null
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
          category: string | null
          asset_type: string | null
          notes: string | null
          owner_user_id: string | null
          approved_by: string | null
          approved_at: string | null
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
          category?: string | null
          asset_type?: string | null
          notes?: string | null
          owner_user_id?: string | null
          approved_by?: string | null
          approved_at?: string | null
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
          category?: string | null
          asset_type?: string | null
          notes?: string | null
          owner_user_id?: string | null
          approved_by?: string | null
          approved_at?: string | null
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      foundation_asset_files: {
        Row: {
          id: string
          foundation_asset_id: string
          organization_id: string
          storage_path: string
          file_name: string
          file_type: string | null
          file_size: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          foundation_asset_id: string
          organization_id: string
          storage_path: string
          file_name: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          foundation_asset_id?: string
          organization_id?: string
          storage_path?: string
          file_name?: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      foundation_asset_links: {
        Row: {
          id: string
          foundation_asset_id: string
          organization_id: string
          url: string
          label: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          foundation_asset_id: string
          organization_id: string
          url: string
          label?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          foundation_asset_id?: string
          organization_id?: string
          url?: string
          label?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      prompt_context_assets: {
        Row: { id: string; prompt_id: string; context_asset_id: string }
        Insert: { id?: string; prompt_id: string; context_asset_id: string }
        Update: { id?: string; prompt_id?: string; context_asset_id?: string }
      }
      agent_context_assets: {
        Row: { id: string; agent_id: string; context_asset_id: string }
        Insert: { id?: string; agent_id: string; context_asset_id: string }
        Update: { id?: string; agent_id?: string; context_asset_id?: string }
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
          department: string | null
          category: string | null
          version: string | null
          last_reviewed: string | null
          risk_level: string | null
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
          department?: string | null
          category?: string | null
          version?: string | null
          last_reviewed?: string | null
          risk_level?: string | null
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
          department?: string | null
          category?: string | null
          version?: string | null
          last_reviewed?: string | null
          risk_level?: string | null
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
          type: string
          department: string | null
          category: string | null
          version: string | null
          risk_level: string | null
          estimated_run_time: string | null
          output_format: string | null
          success_criteria: string | null
          verification_method: string | null
          stop_condition: string | null
          escalation_condition: string | null
          last_reviewed: string | null
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
          type?: string
          department?: string | null
          category?: string | null
          version?: string | null
          risk_level?: string | null
          estimated_run_time?: string | null
          output_format?: string | null
          success_criteria?: string | null
          verification_method?: string | null
          stop_condition?: string | null
          escalation_condition?: string | null
          last_reviewed?: string | null
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
          type?: string
          department?: string | null
          category?: string | null
          version?: string | null
          risk_level?: string | null
          estimated_run_time?: string | null
          output_format?: string | null
          success_criteria?: string | null
          verification_method?: string | null
          stop_condition?: string | null
          escalation_condition?: string | null
          last_reviewed?: string | null
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
      invitations: {
        Row: {
          id: string
          organization_id: string
          email: string
          role: string
          token: string
          status: string
          invited_by: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          role?: string
          token?: string
          status?: string
          invited_by: string
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          role?: string
          token?: string
          status?: string
          invited_by?: string
          created_at?: string
          expires_at?: string
        }
      }
      image_collections: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          name?: string
          created_at?: string
        }
      }
      library_images: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          collection_id: string | null
          storage_path: string
          reference_storage_path: string | null
          title: string | null
          prompt: string
          sref: string | null
          parameters: string | null
          tool: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          collection_id?: string | null
          storage_path: string
          reference_storage_path?: string | null
          title?: string | null
          prompt?: string
          sref?: string | null
          parameters?: string | null
          tool?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          collection_id?: string | null
          storage_path?: string
          reference_storage_path?: string | null
          title?: string | null
          prompt?: string
          sref?: string | null
          parameters?: string | null
          tool?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          title: string
          content: string
          doc_type: string
          status: string
          tags: string[]
          attachment_path: string | null
          attachment_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          title: string
          content?: string
          doc_type?: string
          status?: string
          tags?: string[]
          attachment_path?: string | null
          attachment_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          title?: string
          content?: string
          doc_type?: string
          status?: string
          tags?: string[]
          attachment_path?: string | null
          attachment_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_acknowledgments: {
        Row: {
          id: string
          document_id: string
          user_id: string
          acknowledged_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          acknowledged_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          acknowledged_at?: string
        }
      }
      tool_registry: {
        Row: {
          id: string
          organization_id: string
          created_by: string
          name: string
          status: string
          owner: string | null
          url: string | null
          rationale: string | null
          data_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          created_by: string
          name: string
          status?: string
          owner?: string | null
          url?: string | null
          rationale?: string | null
          data_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          created_by?: string
          name?: string
          status?: string
          owner?: string | null
          url?: string | null
          rationale?: string | null
          data_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usage_events: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          action?: string
          created_at?: string
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
