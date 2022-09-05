<script setup lang="ts">
  import { useAuthUserStore } from '~~/stores/authUser'
  import { get } from '~~/utils';
  const authUser = useAuthUserStore()
  const route = useRoute()
  const router = useRouter()

  onMounted(async () => {
    await get(`/auth/profile`).then(user => {
      authUser.user = user
    }).catch(err => {
      // Forbidden, user not signed in
      authUser.user = null
    })

    redirectAuthUser()
  })
  watch(() => route.fullPath, redirectAuthUser)
  watch(() => authUser.user, redirectAuthUser)

  function redirectAuthUser() {
    let authRoutes = ['index']
    let noAuthRoutes = ['sign-in']

    if (!authUser.user) {
      if (authRoutes.includes(route.name.toString()))
        router.replace({ name: 'sign-in' })
    } else {
      if (noAuthRoutes.includes(route.name.toString()))
        router.replace({ name: 'index' })
    }
  }
</script>

<template>
  <div class="tw-h-screen">
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

html {
  font-family: 'Roboto', sans-serif;
  color: var(--color-pure-black);
  overflow-y: auto !important;
}

.v-btn {
  letter-spacing: unset !important;
  text-transform: unset !important;
  min-width: unset !important;
}

.v-btn--variant-outlined {
  border-color: var(--color-gray);
}
</style>