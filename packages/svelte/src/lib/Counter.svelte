<script lang="ts">
  export let count: number = 0;
  const increment = () => {
    console.trace();
    count += 1;
  };
</script>

<h1>This is Svelte Counter</h1>
<button on:click="{increment}">
  count is {count}
</button>
