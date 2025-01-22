import { supabase } from '$lib/supabase.js';

export async function POST({ request, getClientAddress }) {
    const fact = await request.json()
    console.log("added fact:", fact)
    //supabase.
    return new Response(`Fact saved sucessfully! ${fact}`, { status: 200 })
}