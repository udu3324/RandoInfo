import { createClient } from "@supabase/supabase-js";
import { SUPABASEKEY } from "$env/static/private"

const supabaseUrl = 'https://swbsfmfqxwbpvqvhsdgm.supabase.co'

export const supabase = createClient( supabaseUrl, SUPABASEKEY )

export async function isBlacklisted(ip) {
    const { data, error } = await supabase
    .from('blacklisted')
    .select('ip')
    .eq('ip', ip)
    .single()

    //the only error should be the one where a row is not found
    if (error) {
        if (error.code === "PGRST116") {
            return false
        }
    }

    return true
}