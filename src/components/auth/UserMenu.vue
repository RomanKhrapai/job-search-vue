<template>
    <div class="menu-container">
        <a v-if="role != '' && role != 2 && role != 3" :href="serverHost"><v-tab>admin panel</v-tab></a>
        <div class="menu-btn" @click="useLogOut()">
            <img v-if="image" loading="lazy" :src="image" height="40" width="40" alt="avatar">
            <v-icon v-else size="large" :icon="'mdi-account'"></v-icon>
            {{ name }}

        </div>
    </div>
</template>
  
<script setup>
import { useAuthStore } from "../../store/authStore"
import { storeToRefs } from "pinia"
import { useRoute, useRouter } from 'vue-router'

const serverHost = import.meta.env.VITE_SERVER_HOST;
const route = useRoute()
const router = useRouter()
const { name, image, role } = storeToRefs(useAuthStore())

const { logOut } = useAuthStore()

function useLogOut() {
    logOut();
    router.push({ name: 'home' })
}

</script>
  
<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.menu-container {
    position: absolute;
    right: 20px;
    top: 0;
}

.menu-list {
    background-color: $card-bg;
}

.menu-item {
    list-style: none;
    padding: 2px 5px;
}

.menu-btn {
    color: $secondary-color;
    cursor: pointer;
    display: flex;
    padding: 0 5px;
    align-items: center;
    height: 48px;
    min-width: 90px;
    transition: all 0.3s ease;
}

.menu-btn:hover {
    transform: scale(1.1);
}
</style>