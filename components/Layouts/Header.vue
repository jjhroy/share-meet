<template>
  <header class="flex-in-row bg-white px-3 py-2 text-center">
    <ul class="flex-in-row gap-x-2 ml-a text-gray-400">
      <li>
        <NuxtLink
          to="/chat"
          :class="{
            'text-black': currentPath === '/chat',
          }"
        >
          Chat
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/message"
          :class="{
            'text-black': currentPath === '/message',
          }"
        >
          Message
        </NuxtLink>
      </li>
    </ul>
  </header>
</template>

<script lang="ts" setup>
  import { useDateFormat, useNow } from '@vueuse/core';
  const formatted = useDateFormat(useNow(), 'YYYY年-MM月-DD日');
  const route = useRoute();
  const currentPath = computed(() => route.path);
</script>

<style></style>
