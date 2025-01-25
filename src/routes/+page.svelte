<script>
    import { goto } from "$app/navigation";
    
    let getEndpointURL = ""
    let getResult = `{\n  "text": "Any output of the get endpoint will show up here!"\n}`
    let getResultCode
    let awaitingResponse = false

    async function useGetEndpoint(path) {
        awaitingResponse = true
        getEndpointURL = path

        const response = await fetch(path);
        const json = await response.json()
		getResult = await JSON.stringify(json, null, 2);
        getResultCode = `\n\nStatus: ${response.status}`

        awaitingResponse = false
    }

    let postEndpointURL = ""
    let postResult = `{\n  "text": "Any output of the post endpoint will show up here!"\n}`
    let postResultCode
    let postInput
    let postInput2
    let postPath

    $: {
        //wipe the post inputs as they're shared for each endpoint
        if (postPath) {
            postInput = ""
            postInput2 = ""

            postEndpointURL = postPath
        }
    }

    async function usePostEndpoint() {
        awaitingResponse = true

        let response
        console.log("got value of", postInput)

        switch (postPath) {
            case '/api/v1/string/create':
                postEndpointURL = postPath
                response = await fetch(postPath, {
                    method: "POST",
                    body: JSON.stringify({
                        string: postInput
                    })
                });
                break
            case '/api/v1/string/report':
                postEndpointURL = `${postPath}/${postInput}`
                response = await fetch(`${postPath}/${postInput}`, {
                    method: "POST"
                });
                break
            case '/api/v1/string/blacklist':
                postEndpointURL = `${postPath}/${postInput}`
                response = await fetch(`${postPath}/${postInput}`, {
                    method: "POST",
                    body: JSON.stringify({
                        key: postInput2
                    })
                });
                break
        }

        if (response.status === 404 && postPath === '/api/v1/string/blacklist') {
            postResult = "Incomplete endpoint url. (missing ip in path)"
            postResultCode = "\n\nStatus: 404"
            awaitingResponse = false

            return
        }

        const json = await response.text()
		postResult = await JSON.stringify(json, null, 2);
        postResultCode = `\n\nStatus: ${response.status}`

        awaitingResponse = false
    }
</script>

<div class="container">
    <div class="mid-div">
        <b class="title">RandoInfo API</b>
        <p>A fun little API that gives you some random cool information! Try it below, or look at the swagger to see/interact more about the api.</p>
        <button on:click={() => goto("/api")} style="margin-right:5px">Swagger (API Docs)</button>

        <button on:click={() => window.open("https://github.com/udu3324/randoinfo", "_blank")}>Source Code</button>

        <div class="inner-panel">
            <div style="margin-bottom:5px">
                <h>GET Endpoints <code>{getEndpointURL}</code></h>
            </div>

            <button disabled={awaitingResponse} on:click={() => useGetEndpoint('/api/v1/emoji')}>Emoji</button>
            <button disabled={awaitingResponse} on:click={() => useGetEndpoint('/api/v1/weather')}>Weather Forecast</button>
            <button disabled={awaitingResponse} on:click={() => useGetEndpoint('/api/v1/string')}>String</button>
            <button disabled={awaitingResponse} on:click={() => useGetEndpoint('/api/v1/wikipedia/article')}>Wiki Article</button>
            <button disabled={awaitingResponse} on:click={() => useGetEndpoint('/api/v1/wikipedia/file')}>Wiki File</button>
            <button disabled={awaitingResponse} on:click={() => useGetEndpoint('/api/v1/wikipedia/timedtext')}>Wiki Timedtext</button>

            <div class="result-panel">
                <pre>{getResult}{getResultCode}</pre>
            </div>
        </div>

        <div class="inner-panel">
            <div style="margin-bottom:5px">
                <h>POST Endpoints <code>{postEndpointURL}</code></h>
            </div>

            <button disabled={awaitingResponse} on:click={() => {postPath = "/api/v1/string/create"}}>Create String</button>
            <button disabled={awaitingResponse} on:click={() => {postPath = "/api/v1/string/report"}}>Report String</button>
            <button disabled={awaitingResponse} on:click={() => {postPath = "/api/v1/string/blacklist"}}>Blacklist String</button>

            <div style="margin-top:5px">
                {#if postPath === "/api/v1/string/create"}
                <input bind:value={postInput} type="text" placeholder="String">
                {:else if postPath === "/api/v1/string/report"}
                <input bind:value={postInput} type="number" placeholder="Id of string">
                {:else if postPath === "/api/v1/string/blacklist"}
                <input bind:value={postInput2} type="text" placeholder="Authentication key">
                <br>
                <input bind:value={postInput} type="text" placeholder="IP">
                {/if}

                {#if postPath}
                <button disabled={awaitingResponse} on:click={usePostEndpoint}>POST</button>
                {/if}
            </div>

            <div class="result-panel">
                <pre>{postResult}{postResultCode}</pre>
            </div>
        </div>
    </div>
</div>

<style>
    button {
        border: none;
        color: white;
        background-color: #287a4d;
        padding: 6px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #0b502a;
        cursor: wait;
    }

    button:hover {
        background-color: #0d5e31;
    }

    button:disabled:hover {
        background-color: #0b502a;
        cursor: wait;
    }

    .container {
        width: 100vw;
        height: 80vh;
        margin: auto;
        display: flex;
        justify-content: center;
        padding-top: 10vh;

        font-family: sans-serif;
    }

    .mid-div {
        background-color: whitesmoke;
        padding: 30px;
        margin-left: 20px;
        margin-right: 20px;
        max-width: 550px;
        overflow: auto;
    }

    .title {
        color: #3b4151;
        font-size: 36px;
    }

    .inner-panel {
        margin-top: 30px;
        padding: 15px;
        background-color: rgb(230, 230, 230);
    }

    .result-panel {
        margin-top: 15px;
        padding: 15px;
        background-color: #1e2127;
        color: #dfdfdf;
        overflow: auto;
        border-radius: 5px;
    }

    pre {
        margin-bottom: 0;
        margin-top: 0;
    }
</style>