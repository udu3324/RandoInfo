import { isBlacklisted } from '$lib/supabase.js'

export async function POST({ params, request, getClientAddress }) {
    const isInBlacklist = await isBlacklisted(await getClientAddress())
    //todo
    return new Response(`got ${isInBlacklist}`, { status: 200 })
}
