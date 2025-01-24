import emojis from '$lib/assets/emojis.json'
import { json } from '@sveltejs/kit'

//emojis.json from https://emoji-api.com (fetched on 1/23/2025)

export async function GET() {
    const randomIndex = Math.floor(Math.random() * emojis.length)
    const emoji = emojis[randomIndex]

    const filteredName = toTitleCase(emoji.unicodeName.substring(emoji.unicodeName.indexOf(" ") + 1))

    return json({
        emoji: emoji.character,
        name: filteredName,
        group: `${emoji.group}/${emoji.subGroup}`
    }, { status: 200 })
}

//ty https://stackoverflow.com/a/196991
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    )
}