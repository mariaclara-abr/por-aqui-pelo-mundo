export type AttractionCategory =
  | "ponto_turistico"
  | "restaurante"
  | "hotel"
  | "museu"
  | "natureza"
  | "compras"
  | "passeio"
  | "cafe"
  | "estacionamentos"
  | "parque_tematico"
  | "outro";

export const ATTRACTION_CATEGORIES: {
  value: AttractionCategory;
  label: string;
}[] = [
  { value: "parque_tematico", label: "Parque temático" },
  { value: "ponto_turistico", label: "Ponto turístico" },
  { value: "restaurante", label: "Restaurante" },
  { value: "cafe", label: "Café" },
  { value: "hotel", label: "Hotel" },
  { value: "museu", label: "Museu" },
  { value: "natureza", label: "Natureza" },
  { value: "compras", label: "Compras" },
  { value: "passeio", label: "Passeio" },
  { value: "estacionamentos", label: "Estacionamento" },
  { value: "outro", label: "Outro" },
];

// Uma atração pode ter mais de uma categoria (ex: restaurante e café) — esta
// função monta o texto exibido nos badges/detalhes a partir da lista.
export function categoryLabels(categories: string[]): string {
  return categories
    .map(
      (category) =>
        ATTRACTION_CATEGORIES.find((c) => c.value === category)?.label ??
        category,
    )
    .join(", ");
}

export type CountryStatus = "draft" | "published";

export type UserRole = "user" | "author";

export type ItineraryStatus = "planejando" | "concluida";

export type QuestionStatus = "pendente" | "respondida" | "oculta";

export type PlanType =
  | "roteiro_unico_1pais"
  | "premium_mensal"
  | "premium_anual";

export type TravelProfile = "familia" | "casal" | "sozinho" | "amigos";

export const TRAVEL_PROFILES: { value: TravelProfile; label: string }[] = [
  { value: "familia", label: "Família" },
  { value: "casal", label: "Casal" },
  { value: "sozinho", label: "Sozinho(a)" },
  { value: "amigos", label: "Amigos" },
];

export type TravelPace = "tranquilo" | "moderado" | "intenso";

export const TRAVEL_PACES: { value: TravelPace; label: string }[] = [
  { value: "tranquilo", label: "Tranquilo" },
  { value: "moderado", label: "Moderado" },
  { value: "intenso", label: "Intenso" },
];

export type BudgetRange = "economico" | "moderado" | "confortavel" | "luxo";

export const BUDGET_RANGES: { value: BudgetRange; label: string }[] = [
  { value: "economico", label: "Econômico" },
  { value: "moderado", label: "Moderado" },
  { value: "confortavel", label: "Confortável" },
  { value: "luxo", label: "Luxo" },
];

export const CHILDREN_AGE_RANGES: { value: string; label: string }[] = [
  { value: "0-2", label: "0 a 2 anos" },
  { value: "3-5", label: "3 a 5 anos" },
  { value: "6-12", label: "6 a 12 anos" },
  { value: "13-17", label: "13 a 17 anos" },
];

export interface UserPreferences {
  travelsWithChildren: boolean | null;
  childrenAgeRanges: string[];
  travelProfile: TravelProfile | null;
  pace: TravelPace | null;
  budget: BudgetRange | null;
  interestCategories: AttractionCategory[];
  interestTagIds: string[];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  travelsWithChildren: null,
  childrenAgeRanges: [],
  travelProfile: null,
  pace: null,
  budget: null,
  interestCategories: [],
  interestTagIds: [],
};

export function parseUserPreferences(raw: unknown): UserPreferences {
  if (!raw || typeof raw !== "object") return DEFAULT_PREFERENCES;
  const value = raw as Partial<UserPreferences>;
  return {
    travelsWithChildren: value.travelsWithChildren ?? null,
    childrenAgeRanges: Array.isArray(value.childrenAgeRanges)
      ? value.childrenAgeRanges
      : [],
    travelProfile: value.travelProfile ?? null,
    pace: value.pace ?? null,
    budget: value.budget ?? null,
    interestCategories: Array.isArray(value.interestCategories)
      ? value.interestCategories
      : [],
    interestTagIds: Array.isArray(value.interestTagIds)
      ? value.interestTagIds
      : [],
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          name: string;
          slug: string;
          cover_image_url: string | null;
          cover_image_position: Json | null;
          description: string | null;
          status: CountryStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          cover_image_url?: string | null;
          cover_image_position?: Json | null;
          description?: string | null;
          status?: CountryStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["countries"]["Insert"]>;
        Relationships: [];
      };
      states: {
        Row: {
          id: string;
          country_id: string;
          name: string;
          slug: string;
          cover_image_url: string | null;
          cover_image_position: Json | null;
          description: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_id: string;
          name: string;
          slug: string;
          cover_image_url?: string | null;
          cover_image_position?: Json | null;
          description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["states"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "states_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      cities: {
        Row: {
          id: string;
          country_id: string;
          state_id: string | null;
          name: string;
          slug: string;
          cover_image_url: string | null;
          cover_image_position: Json | null;
          description: string | null;
          latitude: number | null;
          longitude: number | null;
          status: CountryStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_id: string;
          state_id?: string | null;
          name: string;
          slug: string;
          cover_image_url?: string | null;
          cover_image_position?: Json | null;
          description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: CountryStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cities"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cities_state_id_fkey";
            columns: ["state_id"];
            isOneToOne: false;
            referencedRelation: "states";
            referencedColumns: ["id"];
          },
        ];
      };
      attractions: {
        Row: {
          id: string;
          city_id: string;
          parent_attraction_id: string | null;
          name: string;
          slug: string;
          categories: AttractionCategory[];
          description: string | null;
          personal_experience: string | null;
          important_tips: string | null;
          average_visit_time: string | null;
          best_time_of_day: string | null;
          best_season: string | null;
          recommended_audience: string | null;
          price_range: number | null;
          weather_sensitive: boolean;
          intense_physical_effort: boolean;
          requires_advance_purchase: boolean;
          requires_reservation: boolean;
          has_air_conditioning: boolean;
          no_air_conditioning: boolean;
          curation_rating: number | null;
          latitude: number | null;
          longitude: number | null;
          exclusive_perk_description: string | null;
          exclusive_perk_url: string | null;
          exclusive_perk_cta_label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          city_id: string;
          parent_attraction_id?: string | null;
          name: string;
          slug: string;
          categories: AttractionCategory[];
          description?: string | null;
          personal_experience?: string | null;
          important_tips?: string | null;
          average_visit_time?: string | null;
          best_time_of_day?: string | null;
          best_season?: string | null;
          recommended_audience?: string | null;
          price_range?: number | null;
          weather_sensitive?: boolean;
          intense_physical_effort?: boolean;
          requires_advance_purchase?: boolean;
          requires_reservation?: boolean;
          has_air_conditioning?: boolean;
          no_air_conditioning?: boolean;
          curation_rating?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          exclusive_perk_description?: string | null;
          exclusive_perk_url?: string | null;
          exclusive_perk_cta_label?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attractions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "attractions_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attractions_parent_attraction_id_fkey";
            columns: ["parent_attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
        ];
      };
      attraction_photos: {
        Row: {
          id: string;
          attraction_id: string;
          url: string;
          position: Json | null;
          order: number;
          caption: string | null;
        };
        Insert: {
          id?: string;
          attraction_id: string;
          url: string;
          position?: Json | null;
          order?: number;
          caption?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["attraction_photos"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "attraction_photos_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
        Relationships: [];
      };
      attraction_tags: {
        Row: {
          attraction_id: string;
          tag_id: string;
        };
        Insert: {
          attraction_id: string;
          tag_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["attraction_tags"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "attraction_tags_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attraction_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      itineraries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination_city_id: string | null;
          start_date: string | null;
          end_date: string | null;
          status: ItineraryStatus;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          destination_city_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: ItineraryStatus;
          is_public?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["itineraries"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "itineraries_destination_city_id_fkey";
            columns: ["destination_city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
        ];
      };
      itinerary_items: {
        Row: {
          id: string;
          itinerary_id: string;
          attraction_id: string;
          order: number;
          day_number: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          itinerary_id: string;
          attraction_id: string;
          order?: number;
          day_number?: number | null;
          notes?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["itinerary_items"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "itinerary_items_itinerary_id_fkey";
            columns: ["itinerary_id"];
            isOneToOne: false;
            referencedRelation: "itineraries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "itinerary_items_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          preferences: Json;
          current_itinerary_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          preferences?: Json;
          current_itinerary_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_current_itinerary_id_fkey";
            columns: ["current_itinerary_id"];
            isOneToOne: false;
            referencedRelation: "itineraries";
            referencedColumns: ["id"];
          },
        ];
      };
      attraction_questions: {
        Row: {
          id: string;
          attraction_id: string;
          user_id: string;
          question: string;
          status: QuestionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          attraction_id: string;
          user_id: string;
          question: string;
          status?: QuestionStatus;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["attraction_questions"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "attraction_questions_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
        ];
      };
      attraction_answers: {
        Row: {
          id: string;
          question_id: string;
          author_id: string;
          answer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          author_id: string;
          answer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["attraction_answers"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "attraction_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: true;
            referencedRelation: "attraction_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      city_questions: {
        Row: {
          id: string;
          city_id: string;
          user_id: string;
          question: string;
          status: QuestionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          city_id: string;
          user_id: string;
          question: string;
          status?: QuestionStatus;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["city_questions"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "city_questions_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
        ];
      };
      city_answers: {
        Row: {
          id: string;
          question_id: string;
          author_id: string;
          answer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          author_id: string;
          answer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["city_answers"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "city_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: true;
            referencedRelation: "city_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      country_questions: {
        Row: {
          id: string;
          country_id: string;
          user_id: string;
          question: string;
          status: QuestionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_id: string;
          user_id: string;
          question: string;
          status?: QuestionStatus;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["country_questions"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "country_questions_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      country_answers: {
        Row: {
          id: string;
          question_id: string;
          author_id: string;
          answer: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          author_id: string;
          answer: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["country_answers"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "country_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: true;
            referencedRelation: "country_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      country_interest: {
        Row: {
          id: string;
          country_id: string;
          user_id: string | null;
          visitor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_id: string;
          user_id?: string | null;
          visitor_id?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["country_interest"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "country_interest_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      visited_countries: {
        Row: {
          id: string;
          user_id: string;
          country_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          country_id: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["visited_countries"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "visited_countries_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: PlanType;
          itinerary_id: string | null;
          purchase_date: string;
          expiration_date: string | null;
          tips_unlock_expiration: string | null;
          is_active: boolean;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_checkout_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: PlanType;
          itinerary_id?: string | null;
          purchase_date?: string;
          expiration_date?: string | null;
          tips_unlock_expiration?: string | null;
          is_active?: boolean;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_checkout_session_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subscriptions_itinerary_id_fkey";
            columns: ["itinerary_id"];
            isOneToOne: false;
            referencedRelation: "itineraries";
            referencedColumns: ["id"];
          },
        ];
      };
      affiliate_clicks: {
        Row: {
          id: string;
          user_id: string | null;
          affiliate_program: string;
          attraction_id: string | null;
          context: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          affiliate_program: string;
          attraction_id?: string | null;
          context?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["affiliate_clicks"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
        ];
      };
      about_page_content: {
        Row: {
          id: number;
          author_name: string;
          author_photo_url: string | null;
          author_photo_position: Json | null;
          bio: string;
          why_site_text: string;
          quote_text: string;
          travel_photo_1_url: string | null;
          travel_photo_1_position: Json | null;
          travel_photo_2_url: string | null;
          travel_photo_2_position: Json | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          author_name?: string;
          author_photo_url?: string | null;
          author_photo_position?: Json | null;
          bio?: string;
          why_site_text?: string;
          quote_text?: string;
          travel_photo_1_url?: string | null;
          travel_photo_1_position?: Json | null;
          travel_photo_2_url?: string | null;
          travel_photo_2_position?: Json | null;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["about_page_content"]["Insert"]
        >;
        Relationships: [];
      };
      about_visited_countries: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["about_visited_countries"]["Insert"]
        >;
        Relationships: [];
      };
      shared_itineraries: {
        Row: {
          id: string;
          itinerary_id: string;
          share_token: string;
          created_by: string;
          is_public: boolean;
          show_author_name: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          itinerary_id: string;
          share_token: string;
          created_by: string;
          is_public?: boolean;
          show_author_name?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["shared_itineraries"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "shared_itineraries_itinerary_id_fkey";
            columns: ["itinerary_id"];
            isOneToOne: true;
            referencedRelation: "itineraries";
            referencedColumns: ["id"];
          },
        ];
      };
      site_reviews: {
        Row: {
          id: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          order: number;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          reviewer_name: string;
          rating: number;
          comment: string;
          order?: number;
          created_at?: string;
          user_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["site_reviews"]["Insert"]>;
        Relationships: [];
      };
      travel_tips: {
        Row: {
          id: string;
          category: string;
          title: string;
          content: string;
          order: number;
          is_premium: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          title: string;
          content: string;
          order?: number;
          is_premium?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["travel_tips"]["Insert"]>;
        Relationships: [];
      };
      login_attempts: {
        Row: {
          id: number;
          identifier: string;
          ip: string;
          success: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          identifier: string;
          ip: string;
          success: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["login_attempts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_username_available: {
        Args: { check_username: string };
        Returns: boolean;
      };
      search_destinations: {
        Args: { search_query: string; include_drafts?: boolean };
        Returns: {
          result_type: string;
          id: string;
          name: string;
          slug: string;
          city_name: string | null;
          city_slug: string | null;
          country_name: string | null;
          country_slug: string | null;
          rank: number;
        }[];
      };
    };
    Enums: {
      attraction_category: AttractionCategory;
      user_role: UserRole;
      itinerary_status: ItineraryStatus;
      question_status: QuestionStatus;
      plan_type: PlanType;
    };
    CompositeTypes: Record<string, never>;
  };
}
