import { getRedirectURL } from "$lib/wikipedia";
import { json } from "@sveltejs/kit";
import { JSDOM } from 'jsdom'

export async function GET() {
    const url = await getRedirectURL("https://en.wikipedia.org/wiki/Special:Random/TimedText")

    if (!url) {
        return new Response('Unable to get wikipedia redirect url', { status: 400 })
    }

    try {
        const response = await fetch(url)

        if (!response.ok) {
            return new Response('Unable to fetch wikipedia timedtext html', { status: 401 })
        }
        
        const res = await response.text()

        const dom = new JSDOM(res)

        let subtitles = dom.window.document.getElementById('mw-content-text').textContent
        subtitles = subtitles.substring(0, subtitles.indexOf("Retrieved from") - 1)
        subtitles = subtitles.replaceAll("\u003E", "-")

        let transcript = subtitles.split("\n")
        transcript = transcript.filter((val) => val !== "")

        for (let i = transcript.length - 1; i >= 0; i--) {
            if ((i % 3 === 0)) {
                transcript[i + 1] = `${transcript[i]} - ${transcript[i + 1]}`
                transcript.splice(i, 1)
            }
        }

        const source = dom.window.document.getElementsByTagName("source")[0].src.substring(2)

        return json({
            url: url,
            file: source,
            transcript: transcript
        }, { status: 200 })
    } catch (error) {
        return new Response('Error occured while fetching wikipedia timedtext', { status: 402 })
    }
}