export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                    order: number | null
                    slug: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                    order?: number | null
                    slug: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                    order?: number | null
                    slug?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    category_id: string | null
                    created_at: string
                    details: string | null
                    features: string[] | null
                    id: string
                    image_url: string | null
                    name: string
                    subtitle: string | null
                    tags: string[] | null
                }
                Insert: {
                    category_id?: string | null
                    created_at?: string
                    details?: string | null
                    features?: string[] | null
                    id?: string
                    image_url?: string | null
                    name: string
                    subtitle?: string | null
                    tags?: string[] | null
                }
                Update: {
                    category_id?: string | null
                    created_at?: string
                    details?: string | null
                    features?: string[] | null
                    id?: string
                    image_url?: string | null
                    name?: string
                    subtitle?: string | null
                    tags?: string[] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    email: string
                    id: string
                    role: string
                    updated_at: string | null
                }
                Insert: {
                    email: string
                    id: string
                    role?: string
                    updated_at?: string | null
                }
                Update: {
                    email?: string
                    id?: string
                    role?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            resources: {
                Row: {
                    created_at: string
                    file_url: string
                    id: string
                    title: string
                    type: "manual" | "brochure" | "certification"
                }
                Insert: {
                    created_at?: string
                    file_url: string
                    id?: string
                    title: string
                    type: "manual" | "brochure" | "certification"
                }
                Update: {
                    created_at?: string
                    file_url?: string
                    id?: string
                    title?: string
                    type?: "manual" | "brochure" | "certification"
                }
                Relationships: []
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

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
