import { useUserState } from "~/composables/states"
import type { User } from "~/composables/states"

export interface GetMeResponse {
  message: string,
  user: User
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  
  const userState = useUserState()
  const access_token = useCookie('access_token')
  if (!userState.value && access_token.value) {
    await $fetch<GetMeResponse>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${access_token.value}`
      }
    }).then((userdata) => {
      userState.value = userdata.user
    }).catch((err) => {
      console.error(err)
    })
  }

  if (to.path === '/login' && userState.value !== null) {
    return navigateTo('/tournaments')
  }

  if (to.path === '/tournaments/create' && userState.value?.role !== 'ADMIN') {
    return navigateTo('/tournaments')
  }

  const excludedRoutes = ['/login', '/test', '/']
  if (!excludedRoutes.includes(to.path)) {
    if (userState.value === null) {
      return navigateTo('/login')
    }
  }
})