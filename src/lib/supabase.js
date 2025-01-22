import { createClient } from "@supabase/supabase-js";
import { SUPABASEKEY } from "$env/static/private"

const supabaseUrl = 'https://swbsfmfqxwbpvqvhsdgm.supabase.co'

export const supabase = createClient( supabaseUrl, SUPABASEKEY )