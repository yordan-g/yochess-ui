<script>
    export let text;
    export let classes;
</script>

<button class="btn {classes}" on:click>
    {text}
</button>

<style>
    .bd {
        border: 1px dashed rgb(44, 18, 82, 0.5);
        border-radius: 10px;
        transition: border 0.2ms ease;
    }

    .bd:hover {
        border: 1px dashed rgb(44, 18, 82, 0);
    }

    :global(.btn) {
        display: inline-block;
        border: none;
        text-decoration: none;
        background-color: white;
        /*font-size: 40px;*/
        font-family: Helvetica;
        font-weight: lighter;
        padding: 10px 20px;
        /*border: 1px solid #d3d3d3;*/
        /*border-radius: 10px;*/
        color: #2c1252;
        transition: color 0.3s ease;
        position: relative;
        z-index: 1;
    }

    :global(.btn:hover) {
        color: white;
    }

    :global(.btn::before) {
        position: absolute;
        content: "";
        top: -2px;
        right: -2px;
        bottom: -2px;
        left: -2px;
        background-image: linear-gradient(
                to left top,
                #FF00CEFF,
                #7f99ff
        );
        background-clip: border-box;
        z-index: -1;
        transition: opacity 0.2s linear;
        opacity: 0;
        border: 1px solid #ffffff;
        border-radius: 10px;
    }

    :global(.btn:hover::before) {
        opacity: 0.7;
    }
</style>