import { SLACKWEBHOOKURL } from "$env/static/private"

export async function POST({ params, request }) {
    const { path } = params
    console.log("path is", path)
}