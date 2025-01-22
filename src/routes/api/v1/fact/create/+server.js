import { supabase } from '$lib/supabase.js';

export async function POST({ request, getClientAddress }) {
    let fact
    try {
        fact = await request.json()
    } catch (error) {
        return new Response('Invalid json', { status: 401 })
    }

    console.log(fact)
    console.log(fact.fact)

    if (!fact.fact) {
        return new Response('Did not provide fact', { status: 402 })
    }

    if (fact.fact.length < 1) {
        return new Response('Did not provide fact', { status: 402 })
    }

    if (typeof fact.fact !== "string") {
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