import { supabase } from '$lib/supabase.js';

export async function POST({ request, getClientAddress }) {
    //check if a fact is already stored from the same user/ip
    const canContinue = await alreadyCreatedFact(getClientAddress())
    if (canContinue) {
        return new Response("Already created a fact!", { status: 400 })
    }

    let fact
    try {
        fact = await request.json()
    } catch (error) {
        return new Response('Invalid json', { status: 401 })
    }

    if (!fact.fact) {
        return new Response('Did not provide fact', { status: 402 })
    }

    if (typeof fact.fact !== "string") {
        return new Response('Fact provided is not a string', { status: 403 })
    }

    if (fact.fact.trim().length < 1) {
        return new Response('Did not provide fact', { status: 402 })
    }

    const { error } = await supabase.from('facts').insert([{
        fact: fact.fact,
        ip: getClientAddress()
    }])

    if (error) {
        console.log("error", error)
        return new Response("Failed to write to database!", { status: 501 })
    }

    console.log("added fact:", fact)
    return new Response(`Fact saved sucessfully! "${fact.fact}"`, { status: 200 })
}

async function alreadyCreatedFact(ip) {
    const { data, error } = await supabase
    .from('facts')
    .select('*')
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