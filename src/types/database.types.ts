
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
      emission_data: {
        Row: {
          id: string
          region: string
          country: string
          co2: number
          co: number
          ch4: number
          sector: string
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          region: string
          country: string
          co2: number
          co: number
          ch4: number
          sector: string
          year: number
          created_at?: string
        }
        Update: {
          id?: string
          region?: string
          country?: string
          co2?: number
          co?: number
          ch4?: number
          sector?: string
          year?: number
          created_at?: string
        }
      }
      stations: {
        Row: {
          id: string
          name: string
          lat: number
          lng: number
          country: string
          region: string
          efficiency: number
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          lat: number
          lng: number
          country: string
          region: string
          efficiency: number
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          lat?: number
          lng?: number
          country?: string
          region?: string
          efficiency?: number
          last_updated?: string
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
