<template>
    <MainTitle class="title">{{ titleText }}</MainTitle>
    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">
        <CustomInput v-model="title" autocomplete="title" placeholder="enter title" name="title" :rules="titleRules"
            class="login__input" :label="'title'" />

        <CustomOneSelect v-model="company" class="login__input" :label="'company'" :rules="companyRules" name="company"
            :options="data" />

        <CustomManySearchSelect v-model="skills" class="login__input" name="skills" :label="'skills'" :options="data"
            placeholder="select you skill" :rules="skillsRules" />

        <CustomTextArea v-model="description" autocomplete="description" placeholder="enter description" name="description"
            :rules="descriptionRules" class="login__input" :label="'description'" />

        <Button class="login__btn" type="submit">submit</Button>
    </CustomForm>
</template>
  
<script setup>
import CustomManySearchSelect from "./CustomInput/CustomManySearchSelect.vue";

import CustomTextArea from "./CustomInput/CustomTextArea.vue";
import CustomForm from "../../shared/form/CustomForm.vue";
import CustomInput from "../../shared/form/CustomInput/CustomInput.vue";
import Button from "../../shared/form/Button/Button.vue";
import CustomOneSelect from "./CustomInput/CustomOneSelect.vue";
import {
    maxString, minString, isRequired,
} from "../../../utils/validationRules";
import MainTitle from "../../shared/MainTitle.vue";
import { useAuthStore } from "../../../store/authStore"
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router";

defineProps({
    titleText: {
        type: String,
        default: "",
    },
})

const router = useRouter()

const title = ref("")
const company = ref("")
const description = ref("")
const skills = ref([]);
const data = ref([
    { id: 1, label: 'select option', value: '', disabled: true },
    { id: 1, label: 'one option', value: '1' },
    { id: 2, label: 'two option', value: '2' },
    { id: 3, label: 'three option', value: '3' }
]);
const form = ref(null)
const { isAuthorized } = storeToRefs(useAuthStore())

const titleRules = computed(() => [isRequired, maxString(200), minString(3)]);
const descriptionRules = computed(() => [isRequired, maxString(2000), minString(3)]);
const skillsRules = computed(() => [isRequired, maxString(200), minString(3)]);
const companyRules = computed(() => [isRequired,]);

function handleSubmit() {

    const isFormValid = form.value.validate()
    if (isFormValid) {
        console.log({ title: title.value, company: company.value, skills: skills.value, description: description.value });
        // loginUser({ title: title.value, password: password.value });
        form.value.reset()
    }
}
watch(isAuthorized, () => { if (isAuthorized) { router.push({ name: 'home' }) } })

</script>
  
<style lang="scss" scoped>
// @import "./style.module.scss";
</style>