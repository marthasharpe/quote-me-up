// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Simple client for public/anon operations.
// Use this in server components or client components for read-only / anon actions.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
