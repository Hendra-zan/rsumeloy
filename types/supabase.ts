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
      doctors: {
        Row: {
          id: string
          created_at: string
          name: string
          specialization: string
          schedule: Json | null
          image_url: string | null
          display_order: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          specialization: string
          schedule?: Json | null
          image_url?: string | null
          display_order?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          specialization?: string
          schedule?: Json | null
          image_url?: string | null
          display_order?: number | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          title: string
          slug: string
          content: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          slug: string
          content: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          slug?: string
          content?: string
          image_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          role: 'admin' | 'user'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          role?: 'admin' | 'user'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          role?: 'admin' | 'user'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}