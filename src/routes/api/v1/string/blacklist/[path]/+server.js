import { isBlacklisted, isBlacklisted2 } from '$lib/supabase.js'
import { AUTHENTICATIONKEY } from "$env/static/private"

export async function POST({ params, request, getClientAddress }) {
    //const isInBlacklist = await isBlacklisted(getClientAddress())
    //todo
    //return new Response(`got ${isInBlacklist}`, { status: 200 })

    let auth
    try {
        auth = await request.json()
    } catch (error) {
        return new Response('Invalid json', { status: 402 })
    }

    if (!auth.key) {
        return new Response('Did not provide auth key', { status: 403 })
    }

    if (typeof auth.key !== "string") {
        return new Response('Key provided is not a string', { status: 404 })
    }

    const keyTrimmed = auth.key.trim()
    if (keyTrimmed.length < 1) {
        return new Response('Auth key is empty', { status: 403 })
    }

    if (keyTrimmed !== AUTHENTICATIONKEY) {
        return new Response(`Invalid key! ${keyTrimmed}`, { status: 400 })
    }

    return new Response(`Authenticated! ${keyTrimmed}`, { status: 200 })
    

    //const { path } = params

    //if (!path) {
    //    return new Response("Did not provide ip", { status: 300 })
    //}
}
