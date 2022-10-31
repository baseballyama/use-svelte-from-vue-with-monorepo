<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { Counter } from "@flyle/svelte";

  const svelteWrapper = ref<HTMLElement | null>(null);
  onMounted(() => {
    const svelte = new Counter({
      target: svelteWrapper.value!,
      props: {
        name: "World",
      },
    });
  });
</script>

<template>
  <h1>Hi! This is Vue world!</h1>
  <div ref="svelteWrapper" />
</template>
