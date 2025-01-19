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

    return json({
        text: `${forecast.location.name} in ${forecast.location.country}`,
        coordinates: `${coordinates[0]}, ${coordinates[1]}`,
        forecast: forecast,
        sucess: forecast !== undefined
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