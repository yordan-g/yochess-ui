<script lang="ts">
  export let text: string;
  export let classes: string;
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
</style>