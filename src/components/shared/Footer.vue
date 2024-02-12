<template>
    <footer class="footer">
        <div class="footer_wrapper block_first">
            <router-link to="/" class="footer_link">Home</router-link>
            <router-link v-if="isAuthorized" to="/candidates" class="footer_link">Resumes</router-link>
            <router-link to="/vacancies" class="footer_link">Vacancies</router-link>
            <router-link to="/companies" class="footer_link">Companies</router-link>
            <router-link v-if="isAuthorized" to="/my-office" class="footer_link">My-office</router-link>
        </div>
        <div class="footer_wrapper block_second">
            <p>«SearchJob» © 2024</p>
            <p>All rights are protected and protected by the current legislation of Ukraine.
                The use of materials from this site is possible only with the written permission of the company "SearchJob".
                The administration is not responsible for the content of posted ads.
            </p>
        </div>
    </footer>
</template>

<script setup>
import { useAuthStore } from "../../store/authStore"
import { storeToRefs } from "pinia"
import { ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const tab = ref(null)
const { isAuthorized, path } = storeToRefs(useAuthStore());

watch(() => route.meta.id, (id) => {
    tab.value = id;
});

watch(isAuthorized, (newVal) => {
    if (newVal === true && path.value) {
        router.push({ path: path.value });
        auth.clearPath();
    }
})
auth.onAuth();
</script>



<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.footer {
    background-color: #C7B7A3;
    flex-shrink: 0;
    height: auto;
    padding-top: 40px;
    padding-bottom: 40px;
}

.footer_wrapper {

    text-align: center;
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

.block_first {
    border-bottom: 1px solid #ffffff;
    padding-bottom: 40px;
}

.block_second {
    padding-top: 40px;
}

.footer_link {
    text-decoration: none;
    color: #561C24;
    margin-right: 10px;
}

.footer_link:hover {
    color: #8f3e49;
}
</style>
