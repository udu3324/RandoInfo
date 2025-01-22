import { supabase } from '$lib/supabase.js';
import { TextCensor, RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

export async function POST({ request, getClientAddress }) {
    //check if a fact is already stored from the same user/ip
    const numOfFacts = await numOfFactsCreated(getClientAddress())
    if (numOfFacts === -1) {
        return new Response("Failed to read facts database", { status: 500 })
    }

    if (numOfFacts > 9) {
        return new Response("Reached limit of 10 facts", { status: 400 })
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
        return new Response('Fact is empty', { status: 402 })
    }

    //parse fact to be more child friendly
    const censor = new TextCensor()
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const matches = matcher.getAllMatches(fact.fact)

    const parsedFact = censor.applyTo(fact.fact, matches)

    const { error } = await supabase.from('facts').insert([{
        fact: parsedFact,
        ip: getClientAddress()
    }])

    if (error) {
        console.log("error", error)
        return new Response("Failed to write to database!", { status: 501 })
    }

    console.log("added fact:", fact)
    return new Response(`Fact saved sucessfully! "${parsedFact}"`, { status: 200 })
}

async function numOfFactsCreated(ip) {
    const { count, error } = await supabase
    .from('facts')
    .select('*', { count: 'exact', head: true})
    .eq('ip', ip)

    if (error) {
        return -1
    }

    return count
}