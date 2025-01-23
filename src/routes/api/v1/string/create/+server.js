import { supabase, isBlacklisted } from '$lib/supabase.js';
import { TextCensor, RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

export async function POST({ request, getClientAddress }) {
    if (await isBlacklisted(getClientAddress())) {
        return new Response("IP Blacklisted", { status: 599 })
    }
    
    //check if a string is already stored from the same user/ip
    const numOfStrings = await numOfStringsCreated(getClientAddress())
    if (numOfStrings === -1) {
        return new Response("Failed to read strings database", { status: 500 })
    }

    if (numOfStrings > 9) {
        return new Response("Reached creation limit of 10 strings", { status: 401 })
    }

    let string
    try {
        string = await request.json()
    } catch (error) {
        return new Response('Invalid json', { status: 402 })
    }

    if (!string.string) {
        return new Response('Did not provide string', { status: 403 })
    }

    if (typeof string.string !== "string") {
        return new Response('String provided is not a string', { status: 404 })
    }

    const stringTrimmed = string.string.trim()
    if (stringTrimmed.length < 1) {
        return new Response('String is empty', { status: 403 })
    }

    //check if the string is already in the database
    const stringExists = await stringAlreadyInDB(stringTrimmed)
    if (stringExists === undefined) {
        return new Response("Failed to read strings database", { status: 500 })
    }

    if (stringExists) {
        return new Response('String already is in database', { status: 400 })
    }

    //parse string to be more child friendly
    const censor = new TextCensor()
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const matches = matcher.getAllMatches(stringTrimmed)

    const stringCensored = censor.applyTo(stringTrimmed, matches)

    const { error } = await supabase.from('strings').insert([{
        string: stringCensored,
        ip: getClientAddress()
    }])

    if (error) {
        console.log("error", error)
        return new Response("Failed to write to database", { status: 501 })
    }

    console.log("added string:", stringCensored)
    return new Response(`String saved sucessfully! "${stringCensored}"`, { status: 200 })
}

async function numOfStringsCreated(ip) {
    const { count, error } = await supabase
    .from('strings')
    .select('*', { count: 'exact', head: true})
    .eq('ip', ip)

    if (error) {
        return -1
    }

    return count
}

async function stringAlreadyInDB(string) {
    const { data, error } = await supabase
    .from('strings')
    .select('string')
    .ilike('string', `%${string}%`)

    if (error) {
        return undefined
    }

    return data.length > 0
}