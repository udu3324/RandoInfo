import { supabase } from '$lib/supabase.js';
import { TextCensor, RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

export async function POST({ request, getClientAddress }) {
    //check if a string is already stored from the same user/ip
    const numOfStrings = await numOfStringsCreated(getClientAddress())
    if (numOfStrings === -1) {
        return new Response("Failed to read strings database", { status: 500 })
    }

    if (numOfStrings > 9) {
        return new Response("Reached creation limit of 10 strings", { status: 400 })
    }

    let string
    try {
        string = await request.json()
    } catch (error) {
        return new Response('Invalid json', { status: 401 })
    }

    if (!string.string) {
        return new Response('Did not provide string', { status: 402 })
    }

    if (typeof string.string !== "string") {
        return new Response('String provided is not a string', { status: 403 })
    }

    if (string.string.trim().length < 1) {
        return new Response('String is empty', { status: 402 })
    }

    //parse string to be more child friendly
    const censor = new TextCensor()
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });
    const matches = matcher.getAllMatches(string.string)

    const parsedString = censor.applyTo(string.string, matches)

    const { error } = await supabase.from('strings').insert([{
        string: parsedString,
        ip: getClientAddress()
    }])

    if (error) {
        console.log("error", error)
        return new Response("Failed to write to database", { status: 501 })
    }

    console.log("added string:", parsedString)
    return new Response(`String saved sucessfully! "${parsedString}"`, { status: 200 })
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