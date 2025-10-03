import { SupabaseClient, Session } from '@supabase/supabase-js';

export type { Session };

export type TableName = 'doctors' | 'services' | 'facilities' | 'articles' | 'partners' | 'vacancies' | 'info' | 'ai_assistant_config' | 'page_notes';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image_public_id: string;
  schedule: string;
  status: 'Praktek' | 'Tutup';
  status_info?: string;
  notes?: string;
  display_order?: number;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_public_id_1: string;
  image_public_id_2?: string | null;
  image_public_id_3?: string | null;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_public_id_1: string;
  image_public_id_2?: string | null;
  image_public_id_3?: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  image_public_id: string;
  created_at: string; // ISO string date
}

export interface Partner {
  id: string;
  name: string;
  image_public_id: string;
  created_at: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  deadline: string; // ISO string date
  created_at: string;
}

export interface Info {
  id: string;
  title: string;
  description: string;
  image_public_id: string;
  created_at: string;
}

export interface AIAssistantConfig {
    id: string;
    base_prompt: string;
    created_at: string;
}

export interface PageNote {
  id: string;
  page_name: string;
  content: string;
  created_at: string;
}

export type TableRowTypeMap = {
  'doctors': Doctor;
  'services': Service;
  'facilities': Facility;
  'articles': Article;
  'partners': Partner;
  'vacancies': Vacancy;
  'info': Info;
  'ai_assistant_config': AIAssistantConfig;
  'page_notes': PageNote;
};

export type TableRow<T extends TableName> = TableRowTypeMap[T];


export interface LanguageContextType {
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  t: (key: string) => string;
}

export interface DataContextType {
  doctors: Doctor[];
  services: Service[];
  facilities: Facility[];
  articles: Article[];
  partners: Partner[];
  vacancies: Vacancy[];
  info: Info[];
  ai_assistant_config: AIAssistantConfig[];
  page_notes: PageNote[];
  loading: boolean;
  missingTables: TableName[];
  refetch: (tableName: TableName) => Promise<void>;
  addItem: <T extends TableName>(tableName: T, item: Partial<TableRow<T>>) => Promise<any>;
  updateItem: <T extends TableName>(tableName: T, id: string, itemUpdates: Partial<TableRow<T>>) => Promise<any>;
  deleteItem: (tableName: TableName, id: string) => Promise<any>;
}

export interface AuthContextType {
  supabase: SupabaseClient | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}


export interface Translation {
    [key: string]: string;
}

export interface Translations {
    id: Translation;
    en: Translation;
}