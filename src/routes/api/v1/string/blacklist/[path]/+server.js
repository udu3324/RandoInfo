import { isBlacklisted, isBlacklisted2 } from '$lib/supabase.js'

export async function POST({ params, request, getClientAddress }) {
    const isInBlacklist = await isBlacklisted(getClientAddress())
    //todo
    return new Response(`got ${isInBlacklist}`, { status: 200 })
}
