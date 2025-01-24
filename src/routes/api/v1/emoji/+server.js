import { json } from '@sveltejs/kit'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
    const emojis = await fetchEmojisResource()
    
    if (!emojis) {
        return new Response("Unable to fetch emoji resource", { status: 400 })
    }

    const randomIndex = Math.floor(Math.random() * emojis.length)
    const emoji = emojis[randomIndex]

    const filteredName = toTitleCase(emoji.unicodeName.substring(emoji.unicodeName.indexOf(" ") + 1))

    return json({
        emoji: emoji.character,
        name: filteredName,
        group: `${emoji.group}/${emoji.subGroup}`
    }, { status: 200 })
}

//json from https://emoji-api.com (fetched on 1/23/2025)
async function fetchEmojisResource() {
    try {
        const filePath = path.resolve('static/emojis.json')
        const data = await fs.readFile(filePath, 'utf-8')

        return JSON.parse(data)
    } catch (error) {
        return undefined
    }
}

//ty https://stackoverflow.com/a/196991
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    )
}