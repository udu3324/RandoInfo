import { createClient } from "@supabase/supabase-js";
import { SUPABASEKEY } from "$env/static/private"

const supabaseUrl = 'https://swbsfmfqxwbpvqvhsdgm.supabase.co'

export const supabase = createClient( supabaseUrl, SUPABASEKEY )

export async function isBlacklisted(ip) {
    const { data, error } = await supabase
    .from('blacklisted')
    .select('*')
    .eq('ip', ip)

    //the only error should be the one where a row is not found
    if (error) {
        if (error.code === "PGRST116") {
            return false
        }
    }

    if (!data || data.length === 0) {
        return false
    }

    return true
}

export async function isBlacklisted2(ip) {
    const { data, error } = await supabase
    .from('blacklisted')
    .select('*')
    .eq('ip', ip)

    return [ data, error ]
}