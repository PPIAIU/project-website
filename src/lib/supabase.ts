import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = 'https://clfgsfdnyvdjgcevafzw.supabase.co';
const supabaseAnonKey = 'sb_publishable_uUMtMitRuCQ640naoSeHnQ_XQsw9Osr';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript intellisense
export interface YearData {
  id: string;
  year: string;
  created_at: string;
  updated_at: string;
}

export interface Division {
  id: string;
  year_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  division_id: string;
  name: string;
  position: string;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: string | null;
  document_type: string | null;
  version: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
