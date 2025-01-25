import { SLACKWEBHOOKURL } from "$env/static/private"
import { isBlacklisted, supabase } from "$lib/supabase.js";

export async function POST({ params, request, getClientAddress }) {
    if (await isBlacklisted(getClientAddress())) {
        return new Response("IP Blacklisted", { status: 599 })
    }

    const { path } = params
    //console.log("path is", path)

    if (!path) {
        return new Response("Did not provide string id", { status: 300 })
    }

    const id = Number.parseInt(path)
    
    if (Number.isNaN(id)) {
        return new Response("Id provided is not a number", { status: 302 })
    }

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
            reported_string: data.string, 
            ip: getClientAddress()
        }),
    });

    if (!response.ok) {
        return new Response('Failed to create a report for string id', { status: 501 })  
    }

    return new Response(`Sucessfuly created a report for string id ${data.id}`, { status: 200 })
}