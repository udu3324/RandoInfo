import { json } from "@sveltejs/kit"

export async function GET() {
    try {
        const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary")

        if (!response.ok) {
            return new Response('Unable to fetch random wikipedia article', { status: 401 })
        }
        
        const res = await response.json()
        return json({
            title: res.title,
            description: res.description,
            extract: res.extract,
            language: res.lang,
            timestamp: res.timestamp,
            url: res.content_urls.desktop.page,
            page_id: res.pageid
        }, { status: 200 })
    } catch (error) {
        return new Response('An error occured while fetching an article', { status: 402 })
    }
}