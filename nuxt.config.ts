// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@prisma/nuxt'],
  ssr: false,
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  css: ['~/assets/css/base.css'],
  prisma: {
    installStudio: false,
  },
  runtimeConfig: {
    ldap_server: process.env.LDAP_SERVER || '',
    ldap_bind: process.env.LDAP_BIND || '',
    ldap_password: process.env.LDAP_PASSWORD || '',
    jwt_secret: process.env.JWT_SECRET || 'supersecret12347$#%8123984712893adslnm',
    ldap_user_search_base: process.env.LDAP_USER_SEARCH_BASE || '',
  },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  vite: {
    server: {
      hmr: false
    }
 },
  
})