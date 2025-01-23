import { SLACKWEBHOOKURL } from "$env/static/private"
import { supabase } from "$lib/supabase.js";

export async function POST({ params, request }) {
    const { path } = params
    console.log("path is", path)

    if (!path) {
        return new Response("Did not provide string id", { status: 300 })
    }

    const id = Number.parseInt(path)
    
    //search in supabase for a row with the id
    const { data, error } = await supabase
        .from('strings')
        .select('*')
        .eq('id', id)
        .single()
    
    if (error && error.code === 'PGRST116') {
        return new Response("No string stored with provided id", { status: 301 })
    }

    if (error) {
        return new Response("Failed to read strings database", { status: 500 })
    }

    const response = await fetch(SLACKWEBHOOKURL, {
        method: "POST",
        body: JSON.stringify({
            id: data.id,
            reported_string: data.string
        }),
    });

    if (!response.ok) {
        return new Response(`Failed to create a report for string id ${data.id}`, { status: 501 })  
    }

    return new Response(`Sucessfuly created a report for string id ${data.id}`, { status: 200 })
}