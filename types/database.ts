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
      diseases: {
        Row: {
          id: string
          name: string
          description: string | null
          icd_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icd_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icd_code?: string | null
          updated_at?: string
        }
      }
      medicines: {
        Row: {
          id: string
          name: string
          generic_name: string | null
          dosage_form: string | null
          strength: string | null
          description: string | null
          side_effects: string | null
          contraindications: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          generic_name?: string | null
          dosage_form?: string | null
          strength?: string | null
          description?: string | null
          side_effects?: string | null
          contraindications?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          generic_name?: string | null
          dosage_form?: string | null
          strength?: string | null
          description?: string | null
          side_effects?: string | null
          contraindications?: string | null
          updated_at?: string
        }
      }
      disease_medicine_mapping: {
        Row: {
          id: string
          disease_id: string
          medicine_id: string
          recommended_dosage: string | null
          frequency: string | null
          duration: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          disease_id: string
          medicine_id: string
          recommended_dosage?: string | null
          frequency?: string | null
          duration?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          disease_id?: string
          medicine_id?: string
          recommended_dosage?: string | null
          frequency?: string | null
          duration?: string | null
          notes?: string | null
        }
      }
      patient_records: {
        Row: {
          id: string
          patient_name: string
          patient_id_number: string | null
          age: number | null
          weight: number | null
          disease_id: string | null
          medicine_id: string | null
          prescribed_dosage: string | null
          frequency: string | null
          start_date: string | null
          end_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_name: string
          patient_id_number?: string | null
          age?: number | null
          weight?: number | null
          disease_id?: string | null
          medicine_id?: string | null
          prescribed_dosage?: string | null
          frequency?: string | null
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_name?: string
          patient_id_number?: string | null
          age?: number | null
          weight?: number | null
          disease_id?: string | null
          medicine_id?: string | null
          prescribed_dosage?: string | null
          frequency?: string | null
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      calculations: {
        Row: {
          id: string
          name: string
          category: string | null
          formula: string | null
          description: string | null
          unit: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          formula?: string | null
          description?: string | null
          unit?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          formula?: string | null
          description?: string | null
          unit?: string | null
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

export type Disease = Database['public']['Tables']['diseases']['Row']
export type Medicine = Database['public']['Tables']['medicines']['Row']
export type DiseaseMedicineMapping = Database['public']['Tables']['disease_medicine_mapping']['Row']
export type PatientRecord = Database['public']['Tables']['patient_records']['Row']
export type Calculation = Database['public']['Tables']['calculations']['Row']
