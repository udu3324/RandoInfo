import { supabase } from '$lib/supabase.js';
import { json } from '@sveltejs/kit';

export async function GET() {
    const { data, error } = await supabase
    .rpc('get_random_string')
    .limit(1)

    if (error) {
        console.log(error)
        return new Response("Failed to read strings database", { status: 500 })
    }

    const string = data[0]
    console.log(string)
    return json({
        id: string.id,
        string: string.string,
        timestamp: string.created_at,
        report: "Send a POST request to /string/report"
    }, { status: 200 })
}