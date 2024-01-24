<script setup>

import TogleDayOrNight from "@/components/TogleDayOrNight";
import UserMenu from "./components/auth/UserMenu.vue";
import SearchForm from "./components/shared/form/SearchForm.vue";
import Loader from "./components/Loader.vue";
import { useAuthStore } from "./store/authStore"
import { storeToRefs } from "pinia"
import { ref, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();

const router = useRouter();
const route = useRoute();

const isNightMode = ref(null)
const tab = ref(null)

const { isAuthorized, path, role } = storeToRefs(auth)

watch(() => route.meta.id, (id) => {
  tab.value = id;
});

watch(isAuthorized, (newVal) => {
  if (newVal === true && path.value) {
    router.push({ path: path.value });
    auth.clearPath();
  }
})
watch(isNightMode, (val) => localStorage.setItem("isNight", val))

onBeforeMount(() => {
  const isNight = JSON.parse(localStorage.getItem("isNight"))

  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  isNightMode.value = isNight === null ? !hasDarkPreference : isNight
})

auth.onAuth();
</script>



<template>
  <div class="container-app"
    :style="{ backgroundColor: isNightMode ? '#fff' : '#000000e0', color: !isNightMode ? '#aaa' : '#000000e0' }">
    <div class="bg-header" :class="[!isNightMode ? 'bg-header-dark' : 'bg-header-white']">
      <div class="container heder-nav">
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="start">
          <router-link to="/">
            <v-tab :value="1" size="x-large" hide-slider variant="text">
              <span class="logo">
                <v-icon size="x-large" :icon="'mdi-earth'"></v-icon>
                Employment
              </span>
            </v-tab>
          </router-link>
          <router-link to="/films">
            <v-tab :value="2"> blok 1 </v-tab>
          </router-link>

          <router-link v-if="role === 3" to="/addresume">
            <v-tab :value="3">addresume</v-tab>
          </router-link>
          <router-link v-if="role === 2" to="/addvacancy">
            <v-tab :value="4">addvacancy</v-tab>
          </router-link>
          <router-link v-if="role === 2" to="/companies">
            <v-tab :value="5">companies</v-tab>
          </router-link>
          <div class="auth">
            <router-link v-if="!isAuthorized" to="/auth/login">
              <v-tab :value="6">log in</v-tab>
            </router-link>

          </div>

        </v-tabs>
        <UserMenu v-if="isAuthorized"> </UserMenu>
      </div>
      <SearchForm />
    </div>
    <main class="container">
      <RouterView />
      <!-- <Loader v-if="isLoading" /> -->
      <div :class="{ masck: !isNightMode }"></div>
    </main>
    <TogleDayOrNight v-model="isNightMode" />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  padding-right: 20px;
  padding-left: 20px;
  width: 320px;

  @media screen and (min-width: 768px) {
    width: 768px;
    padding-left: 75px;
    padding-right: 75px;
  }

  @media screen and (min-width: 1024px) {
    width: 1024px;
    padding-left: 71px;
    padding-right: 71px;
  }
}

.logo {
  padding: 9px 10px;
  background: radial-gradient(ellipse at 50%, #3333337e, #33333300 75%);

}

.header {
  height: 70px;
  background-color: rgba(238, 238, 238, 0.6);
  border-radius: 0 0 100px 100px / 0 0 50px 50px;

}

.header-nav {
  background: #7e7d7d96;

}

.bg-header {
  min-width: 320px;
  height: 170px;
  animation: show 2s;

  @keyframes show {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

}

.masck {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))
}

.bg-header-dark {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.515), rgba(0, 0, 0, 0.526)),
    center / auto 100% no-repeat url('../src/assets/images/header.jpg'),
    #000103;
}

.bg-header-white {
  background: linear-gradient(90deg, rgba(141, 110, 52, 0.215), rgba(154, 115, 31, 0.226)),
    center / auto 100% no-repeat url('../src/assets/images/header.jpg'),
    #888888;
}

.text-day-night {
  position: fixed;
  bottom: 0px;
  right: 30px;
}

.auth {
  position: absolute;
  right: 20px;
}
</style>