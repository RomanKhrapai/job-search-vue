<script setup>

import TogleDayOrNight from "@/components/TogleDayOrNight";
import UserMenu from "./components/auth/UserMenu.vue";
import Loader from "./components/Loader.vue";
import { useAuthStore } from "./store/authStore"
import { storeToRefs } from "pinia"
import { ref, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useChatsStore } from "./store/chatsStore";
import Footer from "./components/shared/Footer.vue";


const auth = useAuthStore();

const router = useRouter();
const route = useRoute();

const isNightMode = ref(null)
const tab = ref(null)
const nightMode = ref(localStorage.getItem("nightMode") || false)

const { successfulMessage, errorMessage, infoMessage } = storeToRefs(useChatsStore());
const { isAuthorized, path, role } = storeToRefs(useAuthStore());

watch(() => route.meta.id, (id) => {
  tab.value = id;
});

watch(isAuthorized, (newVal) => {
  if (newVal === true && path.value) {
    router.push({ path: path.value });
    auth.clearPath();
  }
})

watch(nightMode, (val) => localStorage.setItem("nightMode", val))

onBeforeMount(() => {
  const isNight = JSON.parse(localStorage.getItem("nightMode"))

  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  nightMode.value = isNight === null ? !hasDarkPreference : isNight
})


watch(successfulMessage, (newVal) => {
  if (newVal) toast(newVal, {
    "type": "success"
  })
});
watch(errorMessage, (newVal) => {
  if (newVal) toast(newVal, {
    "type": "error"
  })
});
watch(infoMessage, (newVal) => {
  if (newVal) toast(newVal, {
    "type": "info"
  })
});

auth.onAuth();
</script>



<template>
  <div id="page1" class="container-app" :class="{ 'theme-dark': nightMode }">

    <div class="bg-header" :class="[nightMode ? 'bg-header-dark' : 'bg-header-white']">
      <div class="container heder-nav">
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="start">
          <router-link to="/">
            <v-tab :value="1" size="x-large" hide-slider variant="text">
              <span :class="[nightMode ? 'logo-dark' : 'logo']">
                <v-icon size="x-large" :icon="'mdi-earth'"></v-icon>
              </span>
            </v-tab>
          </router-link>

          <router-link v-if="isAuthorized" to="/candidates" :class="[nightMode && 'link']">
            <v-tab :value="3">resumes</v-tab>
          </router-link>
          <router-link to="/vacancies" :class="[nightMode && 'link']">
            <v-tab :value="4">vacancies</v-tab>
          </router-link>
          <router-link to="/companies" :class="[nightMode && 'link']">
            <v-tab :value="5">companies</v-tab>
          </router-link>
          <router-link v-if="isAuthorized" to="/my-office" :class="[nightMode && 'link']">
            <v-tab :value="2"> my-office </v-tab>
          </router-link>

          <div class="auth">
            <router-link v-if="!isAuthorized" to="/auth/login">
              <v-tab :value="6">log in</v-tab>
            </router-link>

          </div>

        </v-tabs>
        <UserMenu v-if="isAuthorized" />
      </div>
      <input type="checkbox" id="theme-toggle" v-model="nightMode">
      <label class="theme-toggle" for="theme-toggle"><span></span></label>
    </div>
    <main class="container">
      <RouterView />
      <!-- <Loader v-if="isLoading" /> -->
      <div :class="{ masck: !isNightMode }"></div>
    </main>
    <!-- <TogleDayOrNight v-model="isNightMode" /> -->
  </div>
</template>

<style scoped lang="scss">
@import "./assets/scss/variables.scss";

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

.logo-dark {
  padding: 9px 10px;
  background: radial-gradient(ellipse at 50%, #ffffff, #33333300 75%);
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
  display: flex;

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
  // background: linear-gradient(90deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))
}

.bg-header-dark {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.515), rgba(0, 0, 0, 0.526)),
    center / auto 100% no-repeat url('../src/assets/images/header.jpg'),
    #66232c;
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
