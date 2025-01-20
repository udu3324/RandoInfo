import { WEATHERAPIKEY } from "$env/static/private"
import { json } from "@sveltejs/kit"
import cities from "all-the-cities"

export async function GET() {
    let forecast
    let coordinates

    //there are some cities that can't be found in the api sadly
    for (let i = 0; i < 1000; i++) {
        console.log(`request ${i} out of 1000`)

        coordinates = getRandomCityCoordinates()
        forecast = await getForecast(coordinates[0], coordinates[1])

        if (forecast !== undefined) {
            console.log("worked!")
            break
        }
    }

    if (forecast === undefined) {
        return json({
            sucess: false
        })
    }

    //ty https://www.reddit.com/r/EnglishLearning/comments/7o8rdm/the_definitive_scale_of_english_adjectives_to/
    const tempC = forecast.current.temp_c
    let tempDescription = ""
    let emojiDescription = ""

    if (tempC <= -9) {
        tempDescription = "freezing"
        emojiDescription = "🧊"
    } else if (tempC <= 0) {
        tempDescription = "cold"
        emojiDescription = "🥶"
    } else if (tempC <= 4) {
        tempDescription = "chilly"
        emojiDescription = "🤧"
    } else if (tempC <= 8) {
        tempDescription = "brisk"
        emojiDescription = "🧥"
    } else if (tempC <= 13) {
        tempDescription = "cool"
        emojiDescription = "😶‍🌫️"
    } else if (tempC <= 18) {
        tempDescription = "crisp"
        emojiDescription = "🍃"
    } else if (tempC <= 25) {
        tempDescription = "gorgeous"
        emojiDescription = "😎"
    } else if (tempC <= 29) {
        tempDescription = "warm"
        emojiDescription = "☀️"
    } else if (tempC <= 33) {
        tempDescription = "hot"
        emojiDescription = "🥵"
    } else {
        tempDescription = "boiling"
        emojiDescription = "🔥"
    }

    const forecastDescription = forecast.current.condition.text.toLowerCase()

    let appendEnd = " weather"
    if (forecastDescription.includes(" ") && !forecastDescription.match(/cloudy$/g)) {
        appendEnd = ""
    }

    return json({
        continent: forecast.location.tz_id,
        local_time: forecast.location.localtime,
        description: `It is currently ${tempDescription} in ${forecast.location.name} (${forecast.location.country}) with ${forecastDescription}${appendEnd}.`,
        icon: emojiDescription,
        temperature: {
            fahrenheit: forecast.current.temp_f,
            celcius: forecast.current.temp_c,
        },
        coordinates: {
            latitude: coordinates[0],
            longitude: coordinates[1]
        },
        google_maps: `https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`,
        open_street_maps: `https://www.openstreetmap.org/?mlat=${coordinates[0]}&mlon=${coordinates[1]}`,
        sucess: true
    })
}

function getRandomCityCoordinates() {
    const index = Math.floor(Math.random() * cities.length)
    const coordinates = cities[index].loc.coordinates

    return [coordinates[0], coordinates[1]]
}

async function getForecast(latitude, longitude) {
    const url = `https://api.weatherapi.com/v1/current.json?q=${latitude},${longitude}&key=${WEATHERAPIKEY}`

    try {
        const response = await fetch(url)
        
        if (response.status === 200) {
            return await response.json()
        }

        return undefined
    } catch (error) {
        console.log("bad!!!")
        return undefined
    }
}