import { getRedirectURL } from "$lib/wikipedia";
import { json } from "@sveltejs/kit";
import { JSDOM } from 'jsdom'

export async function GET() {
    const url = await getRedirectURL("https://en.wikipedia.org/wiki/Special:Random/File")
    
    if (!url) {
        return new Response('Unable to get wikipedia redirect url', { status: 400 })
    }

    try {
        const response = await fetch(url)

        if (!response.ok) {
            return new Response('Unable to fetch wikipedia file html', { status: 401 })
        }
        
        const res = await response.text()

        const dom = new JSDOM(res)

        let source = dom.window.document.querySelector('.fullImageLink').firstChild.firstChild.src

        //remove any query if neccesary
        let query = source.length
        if (source.indexOf("?") !== -1) {
            query = source.indexOf("?")
        }

        source = source.substring(2, query)

        const descriptionElement = dom.window.document.getElementById('fileinfotpl_desc')
        let description

        if (descriptionElement) {
            const descriptionElementChild = dom.window.document.getElementById('fileinfotpl_desc').lastElementChild

            if (descriptionElementChild) {
                description = descriptionElementChild.textContent.replaceAll("\n", "").replace(/\s+/g,' ').trim()
            }
        }

        return json({
            url: url,
            file: `https://${source}`,
            description: description
        }, { status: 200 })
    } catch (error) {
        return new Response('Error occured while fetching wikipedia file', { status: 402 })
    }
}