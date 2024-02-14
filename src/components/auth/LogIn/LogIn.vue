<template>
    <AuthContainer class="registration">
        <MainTitle class="registration__title">Login</MainTitle>
        <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">
            <CustomInput v-model="email" autocomplete="email" placeholder="Email" name="email" :rules="emailRules"
                class="login__input" :label="'Email'" />
            <CustomInput v-model="password" type="password" autocomplete="current-password" placeholder="Password"
                name="password" :rules="passwordRules" class="login__input" :label="'Password'" />
            <Button class="login__btn" type="submit">Sign in</Button>

        </CustomForm>
        <div class="wraper_link">
            <span class="link" @click="$router.push({ name: 'registration' })">Registration</span>
            <a class="link" href="http://127.0.0.1:8080/auth/redirect">
                <svg class="image" xmlns="https://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path fill="#4285F4"
                        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z">
                    </path>
                    <path fill="#34A853"
                        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z">
                    </path>
                    <path fill="#FBBC05"
                        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z">
                    </path>
                    <path fill="#EA4335"
                        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z">
                    </path>
                    <path fill="none" d="M2 2h44v44H2z"></path>
                </svg>
            </a>
        </div>
    </AuthContainer>
</template>
  
<script setup>
import CustomForm from "../../shared/form/CustomForm.vue";
import AuthContainer from "../AuthContainer.vue"
import CustomInput from "../../shared/form/CustomInput.vue";
import Button from "../../shared/form/Button.vue";
import {
    emailValidation, passwordValidation, isRequired,
} from "../../../utils/validationRules";
import MainTitle from "../../shared/MainTitle.vue";
import { useAuthStore } from "../../../store/authStore"
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()

const email = ref("")
const password = ref("")
const form = ref(null)
const { isAuthorized } = storeToRefs(useAuthStore())
const { loginUser } = useAuthStore()

const emailRules = computed(() => [isRequired, emailValidation])

const passwordRules = computed(() => [isRequired, passwordValidation]);

function handleSubmit() {

    const isFormValid = form.value.validate()
    if (isFormValid) {
        loginUser({ email: email.value, password: password.value });
        form.value.reset()
    }
}
watch(isAuthorized, () => { if (isAuthorized) { router.push({ name: 'home' }) } })

</script>
  
<style lang="scss" scoped>
@import "./style.module.scss";
</style>