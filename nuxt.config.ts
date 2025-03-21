// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxtjs/device', '@vueuse/nuxt', '@nuxt/icon', 'nuxt-lodash'],
  build: {
    transpile: ['vue-virtual-scroller'],
  },
  devServer: {
    port: 2333,
    host: '0.0.0.0',
  },
});
