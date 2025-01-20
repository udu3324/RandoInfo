<script>

    import { goto } from "$app/navigation";
    
</script>

<div class="container">
    <div class="mid-div">
        <b class="title">RandoInfo API</b>
        <p>A fun little API that gives you some random cool information! Try it below, or look at the swagger to see more about the api.</p>
        <button on:click={() => goto("/api")} style="margin-right:5px">Swagger</button>

        <button on:click={() => window.open("https://github.com/udu3324/randoinfo", "_blank")}>Source Code</button>
    </div>
</div>

<style>
    button {
        border: none;
        color: white;
        background-color: #287a4d;
        padding: 6px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0d5e31;
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
    }

    .title {
        color: #3b4151;
        font-size: 36px;
    }
</style>