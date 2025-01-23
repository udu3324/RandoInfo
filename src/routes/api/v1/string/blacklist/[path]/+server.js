import { supabase, isBlacklisted } from '$lib/supabase.js'
import { AUTHENTICATIONKEY } from "$env/static/private"

export async function POST({ params, request, getClientAddress }) {
    if (await isBlacklisted(getClientAddress())) {
        return new Response("IP Blacklisted", { status: 599 })
    }

    let auth
    try {
        auth = await request.json()
    } catch (error) {
        return new Response('Invalid json', { status: 300 })
    }

    if (!auth.key) {
        return new Response('Did not provide auth key', { status: 301 })
    }

    if (typeof auth.key !== "string") {
        return new Response('Key provided is not a string', { status: 302 })
    }

    const keyTrimmed = auth.key.trim()
    if (keyTrimmed.length < 1) {
        return new Response('Auth key is empty', { status: 303 })
    }

    if (keyTrimmed !== AUTHENTICATIONKEY) {
        return new Response('Invalid authentication key', { status: 304 })
    }

    const { path } = params

    if (!path) {
        return new Response("Did not provide ip", { status: 400 })
    }

    //check if the ip is valid
    if (!/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(path)) {
        return new Response("IP provided is invalid", { status: 401 })
    }

    const ipAlreadyBlacklisted = await isBlacklisted(path)

    if (ipAlreadyBlacklisted) {
        return new Response('IP already blacklisted', { status: 402 })
    }

    const { error } = await supabase.from('blacklisted').insert([{
        ip: path
    }])

    if (error) {
        return new Response("Failed to write to database", { status: 500 })
    }

    return new Response(`Sucessfully blacklisted ip ${path}`, { status: 200 })
}
