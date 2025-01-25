import { createClient } from "@supabase/supabase-js";
import { SUPABASEKEY } from "$env/static/private"
import { SUPABASEURL } from "$env/static/private"

export const supabase = createClient( SUPABASEURL, SUPABASEKEY )

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