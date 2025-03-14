<template>
  <div class="container">
    <Typer text="欢迎使用打字机效果" />
  </div>
</template>

<script setup lang="ts">
  import Typer from '~/components/Typer/Typer.vue';
</script>

<style>
  .container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
  }
</style>
