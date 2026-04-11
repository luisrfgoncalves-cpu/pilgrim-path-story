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
      allowed_emails: {
        Row: {
          created_at: string | null
          email: string
          id: string
          used: boolean | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      game_players: {
        Row: {
          attributes: Json
          color: string
          created_at: string | null
          display_name: string
          finish_order: number | null
          finished: boolean | null
          id: string
          is_stunned: boolean | null
          last_dice_roll: number | null
          last_event: string | null
          position: number
          room_id: string
          stun_turns: number | null
          user_id: string
        }
        Insert: {
          attributes?: Json
          color?: string
          created_at?: string | null
          display_name?: string
          finish_order?: number | null
          finished?: boolean | null
          id?: string
          is_stunned?: boolean | null
          last_dice_roll?: number | null
          last_event?: string | null
          position?: number
          room_id: string
          stun_turns?: number | null
          user_id: string
        }
        Update: {
          attributes?: Json
          color?: string
          created_at?: string | null
          display_name?: string
          finish_order?: number | null
          finished?: boolean | null
          id?: string
          is_stunned?: boolean | null
          last_dice_roll?: number | null
          last_event?: string | null
          position?: number
          room_id?: string
          stun_turns?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          board_events: string[] | null
          board_size: number
          code: string
          created_at: string | null
          current_turn_player_id: string | null
          host_id: string
          id: string
          max_players: number
          status: string
          turn_order: string[] | null
        }
        Insert: {
          board_events?: string[] | null
          board_size?: number
          code: string
          created_at?: string | null
          current_turn_player_id?: string | null
          host_id: string
          id?: string
          max_players?: number
          status?: string
          turn_order?: string[] | null
        }
        Update: {
          board_events?: string[] | null
          board_size?: number
          code?: string
          created_at?: string | null
          current_turn_player_id?: string | null
          host_id?: string
          id?: string
          max_players?: number
          status?: string
          turn_order?: string[] | null
        }
        Relationships: []
      }
      pilgrim_history: {
        Row: {
          attributes: Json
          choices_made: number
          completed_at: string | null
          flags: Json
          id: string
          playthrough: number
          result: string
          user_id: string
        }
        Insert: {
          attributes: Json
          choices_made?: number
          completed_at?: string | null
          flags?: Json
          id?: string
          playthrough?: number
          result: string
          user_id: string
        }
        Update: {
          attributes?: Json
          choices_made?: number
          completed_at?: string | null
          flags?: Json
          id?: string
          playthrough?: number
          result?: string
          user_id?: string
        }
        Relationships: []
      }
      pilgrim_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      pilgrim_progress: {
        Row: {
          attributes: Json
          choices_made: number
          created_at: string | null
          current_chapter_id: string
          decisions: Json
          emotional_state: string | null
          flags: Json
          id: string
          items: Json
          playthrough: number
          started: boolean
          updated_at: string | null
          user_id: string
          visited_chapters: Json
        }
        Insert: {
          attributes?: Json
          choices_made?: number
          created_at?: string | null
          current_chapter_id?: string
          decisions?: Json
          emotional_state?: string | null
          flags?: Json
          id?: string
          items?: Json
          playthrough?: number
          started?: boolean
          updated_at?: string | null
          user_id: string
          visited_chapters?: Json
        }
        Update: {
          attributes?: Json
          choices_made?: number
          created_at?: string | null
          current_chapter_id?: string
          decisions?: Json
          emotional_state?: string | null
          flags?: Json
          id?: string
          items?: Json
          playthrough?: number
          started?: boolean
          updated_at?: string | null
          user_id?: string
          visited_chapters?: Json
        }
        Relationships: []
      }
      pilgrim_support: {
        Row: {
          created_at: string | null
          from_user_id: string
          id: string
          message: string | null
          support_type: string
          to_user_id: string
        }
        Insert: {
          created_at?: string | null
          from_user_id: string
          id?: string
          message?: string | null
          support_type?: string
          to_user_id: string
        }
        Update: {
          created_at?: string | null
          from_user_id?: string
          id?: string
          message?: string | null
          support_type?: string
          to_user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_style: string
          bio: string
          created_at: string
          current_phase: number
          display_name: string
          id: string
          journey_preference: string
          total_choices: number
          updated_at: string
        }
        Insert: {
          avatar_style?: string
          bio?: string
          created_at?: string
          current_phase?: number
          display_name?: string
          id: string
          journey_preference?: string
          total_choices?: number
          updated_at?: string
        }
        Update: {
          avatar_style?: string
          bio?: string
          created_at?: string
          current_phase?: number
          display_name?: string
          id?: string
          journey_preference?: string
          total_choices?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      kiwify_webhook: { Args: { "": Json }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
