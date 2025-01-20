<script>

    import { goto } from "$app/navigation";

</script>

<div>
    <b class="title">404</b>
    <p>No endpoint exists here!</p>

    <button on:click={() => goto("/")}>Go back</button>
</div>

<style>
    button {
        bottom: 30px;
        position: absolute;

        border: none;
        color: white;
        background-color: #464646;
        padding: 6px;
        cursor: pointer;
    }

    button:hover {
        background-color: #303030;
    }

    div {
        padding: 30px;
        font-family: sans-serif;
    }

    .title {
        color: #3b4151;
        font-size: 36px;
    }
</style>