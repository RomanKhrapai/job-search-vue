<template>
    <AuthContainer class="registration">
        <MainTitle class="registration__title">Sign up</MainTitle>
        <CustomForm ref="form" class="registration__form" @submit.prevent="handleSubmit">
            <CustomInput v-model="name" autocomplete="username" placeholder="Name" name="name" :label="'Name'"
                :rules="nameRules" class="registration__input" />
            <CustomInput v-model="email" autocomplete="email" placeholder="Email" name="email" :rules="emailRules"
                class="registration__input" :label="'Email'" />
            <CustomInput v-model="password" type="password" autocomplete="current-password" placeholder="Password"
                name="password" :rules="passwordRules" class="registration__input" :label="'Password'" />
            <CustomInput v-model="confirmPassword" type="password" autocomplete="current-password"
                placeholder="Confirm password" name="password" :rules="confirmPasswordRules" class="registration__input"
                :label="'Confirm password'" />
            <div class="wrapper_radio">
                <CustomRadio v-model="role" name="role" value='3' class="registration__input check-box__input"
                    :label="'Employer'" />
                <CustomRadio v-model="role" name="role" value='2' class="registration__input check-box__input"
                    :label="'Worker'" />
            </div>


            <CustomCheckBox v-model="agreeToRules" type="checkbox" name="rules" :rules="checkBoxRules"
                class="registration__input check-box__input" :label="'Agreement with the rules of the site'"
                :labelClass="'line__label'" />
            <Button class="registration__btn" type="submit">Sign up</Button>
        </CustomForm>
        <span class="link" @click="$router.push({ name: 'login' })">Already registered</span>

    </AuthContainer>
</template>
  
<script setup>
import CustomForm from "../../shared/form/CustomForm.vue";
import AuthContainer from "../AuthContainer.vue"
import CustomInput from "../../shared/form/CustomInput.vue";
import CustomRadio from "../../shared/form/CustomRadio.vue";
import CustomCheckBox from "../../shared/form/CustomCheckBox.vue";
import Button from "../../shared/form/Button.vue";
import {
    emailValidation, passwordValidation, isRequired, nameValidation,
} from "../../../utils/validationRules";
import MainTitle from "../../shared/MainTitle.vue";
import { useAuthStore } from "../../../store/authStore"
import { storeToRefs } from "pinia"
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref("")
const email = ref("")
const role = ref("3")
const password = ref("")
const confirmPassword = ref("")
const agreeToRules = ref(false)


const form = ref(null)


const { registerUser } = useAuthStore()
const { isAuthorized } = storeToRefs(useAuthStore())

const nameRules = computed(() => [isRequired, nameValidation]);
const emailRules = computed(() => [isRequired, emailValidation])
const passwordRules = computed(() => [isRequired, passwordValidation])
const confirmPasswordRules = computed(() => [(val) => val !== password.value ? "Passwords do not match" : null])
const checkBoxRules = computed(() => [() => !agreeToRules.value ? "Consent not confirmed" : null])

function handleSubmit() {
    const isFormValid = form.value.validate()
    if (isFormValid) {
        registerUser({ name: name.value, role: role.value, email: email.value, password: password.value });
        form.value.reset()
    }
}

watch(isAuthorized, () => router.push({ name: 'home' })) 
</script>
  
<style lang="scss" scoped>
@import "./style.module.scss";

.wrapper_radio {
    display: flex;
    align-items: center;
}
</style>