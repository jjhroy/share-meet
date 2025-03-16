// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxtjs/device', '@vueuse/nuxt', '@nuxt/icon'],
  build: {
    transpile: ['vue-virtual-scroller'],
  },
});
