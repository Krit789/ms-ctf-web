import { useUserState } from "~/composables/states"
import type { User } from "~/composables/states"

interface GetMeResponse {
  message: string,
  user: User
}

export default defineNuxtRouteMiddleware((to, from) => {
  
  const userState = useUserState()
  const access_token = useCookie('access_token')
  if (!userState.value && access_token.value) {
    const { data: userdata } = useFetch<GetMeResponse>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${access_token.value}`
      }
    })
    userState.value = userdata.value?.user || null
  }

  const excludedRoutes = ['/login', '/']
  if (!excludedRoutes.includes(to.path)) {
    if (userState.value === null) {
      return navigateTo('/login')
    }
  }
})