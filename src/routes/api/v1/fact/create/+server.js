import { supabase } from '$lib/supabase.js';

export async function POST({ request, getClientAddress }) {
    const fact = await request.text().trim()

    if (!fact) {
        return new Response('Did not provide fact', { status: 401 })
    }

    if (fact.length < 1) {
        return new Response('Did not provide fact', { status: 402 })
    }

    if (typeof fact !== "string") {
        return new Response('Fact provided is not a string', { status: 403 })
    }

    console.log("added fact:", fact)
    const { error } = await supabase.from('facts').insert([{
        fact: fact,
        ip: getClientAddress()
    }])

    if (error) {
        return new Response("Failed to write to database!", { status: 500 })
    }

    return new Response(`Fact saved sucessfully! "${fact}"`, { status: 200 })
}