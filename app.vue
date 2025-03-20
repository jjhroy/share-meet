<template>
  <div class="flex-in-col min-h-screen">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
  useHead({
    script: [
      {
        src: 'https://app.val.qq.com/jsapi/mval.js',
        async: true,
        defer: true,
      },
    ],
  });
</script>
