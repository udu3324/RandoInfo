[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-%23f1413d.svg?logo=svelte&logoColor=white)](#)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)](#)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)](#)
[![Slack](https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=fff)](#)

# RandoInfo

A simple little API built on a small stack. It provides random information from wikipedia, the forecast, and more.

## API Docs/Swagger

You can try out RandoInfo [here](https://rando-info.vercel.app/) with a full frontend! The swagger api docs are avaliable [here](https://rando-info.vercel.app/api) too.

All endpoints are under `/api/v1`

## Developing/Running RandoInfo

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open

# use pnpm to install extra packages
pnpn i (pkg name)
```

## Environment Variables

Rename example.env to .env, and get your api keys from [weatherapi](https://www.weatherapi.com) (forecast info), [supabase](https://supabase.com/) (string storing), and slack (string reporting) to get RandoInfo up and running!

```env
WEATHERAPIKEY=
SUPABASEURL=
SUPABASEKEY=
# create a slack workflow that starts with a webhook & accepts json keys: ip, reported_string, id
SLACKWEBHOOKURL=
# create your own unique key to authenticate requests with the api
AUTHENTICATIONKEY=
```