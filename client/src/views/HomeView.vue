<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  setup() {
    const auth0 = useAuth0()

    return {
      login() {
        auth0.loginWithRedirect({
          appState: {
            target: '/dashboard'
          }
        })
      }
    }
  }
}
</script>

<template>
  <main className="flex h-screen items-center justify-center bg-[#f1eade] flex-col">
    <img
      src="https://assets-global.website-files.com/6297d5d89ac9c5b4308579e1/6297d5d89ac9c550828579f0_Logo.svg"
      alt="Finni Logo"
      class="pb-9"
    />
    <button
      @click="login"
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Login
    </button>
  </main>
</template>
