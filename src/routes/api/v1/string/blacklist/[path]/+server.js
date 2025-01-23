import { isBlacklisted, isBlacklisted2 } from '$lib/supabase.js'

export async function POST({ params, request, getClientAddress }) {
    const isInBlacklist = await isBlacklisted(await getClientAddress())
    const test = await isBlacklisted2(await getClientAddress())
    //todo
    return new Response(`got ${isInBlacklist}, ${test[0]}, ${test[1]}`, { status: 200 })
}
