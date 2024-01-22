<template>
    <MainTitle class="title">{{ titleText }}</MainTitle>
    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">
        <CustomInput v-model="title" autocomplete="title" placeholder="enter title" name="title" :rules="titleRules"
            class="login__input" :label="'title'" />

        <CustomOneSelect v-model="company" class="login__input" :label="'company'" :rules="companyRules" name="company"
            :options="companies" />

        <CustomOneSearchSelect v-model="area" class="login__input" :label="'area'" :rules="areaRules" name="area"
            :options="areas" />

        <CustomOneSearchSelect v-model="profesion" class="login__input" :label="'profesion'" :rules="profesionRules"
            name="profesion" :options="profesions" />

        <CustomInput v-model="salary" autocomplete="salary" placeholder="enter salary" name="salary" :rules="salaryRules"
            class="login__input" :label="'salary'" />

        <CustomInput v-model="maxSalary" autocomplete=" max salary" placeholder="enter max salary" name="maxSalary"
            :rules="maxSalaryRules" class="login__input" :label="'max salary'" />

        <CustomManySearchSelect v-model="skills" class="login__input" name="skills" :label="'skills'" :options="data"
            placeholder="select you skill" :rules="skillsRules" />

        <CustomOneSelect v-model="nature" class="login__input" :label="'nature'" :rules="natureRules" name="nature"
            :options="natures" />

        <CustomOneSelect v-model="type" class="login__input" :label="'type'" :rules="typeRules" name="type"
            :options="types" />

        <CustomTextArea v-model="description" autocomplete="description" placeholder="enter description" name="description"
            :rules="descriptionRules" class="login__input" :label="'description'" />

        <Button class="login__btn" type="submit">submit</Button>
    </CustomForm>
</template>
  
<script setup>
import CustomManySearchSelect from "./CustomInput/CustomManySearchSelect.vue";
import CustomOneSearchSelect from "./CustomInput/CustomOneSearchSelect.vue";
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
import { useFormParametersStore } from '../../../store/formParametersStore'
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router";
import { debounce } from "../../../utils/debounce";

defineProps({
    titleText: {
        type: String,
        default: "",
    },
})

const router = useRouter()

const title = ref("")
const company = ref("")
const profesion = ref({ id: '', name: '' });
const area = ref({ id: '', name: '' });
const salary = ref("")
const maxSalary = ref("")
const nature = ref("")
const type = ref("")
const description = ref("")
const skills = ref([]);
const data = ref([
    { id: 1, label: 'select option', value: '', disabled: true },
    { id: 1, label: 'one option', value: '1' },
    { id: 2, label: 'two option', value: '2' },
    { id: 3, label: 'three option', value: '3' }
]);
const form = ref(null)
const { isAuthorized, companies } = storeToRefs(useAuthStore());
const { getAreas, getProfesions, getFormParameters } = useFormParametersStore();
const { profesions, types, natures, areas } = storeToRefs(useFormParametersStore());

const titleRules = computed(() => [isRequired, maxString(200), minString(3)]);
const descriptionRules = computed(() => [isRequired, maxString(2000), minString(3)]);
const skillsRules = computed(() => [isRequired, maxString(200), minString(3)]);
const companyRules = computed(() => [isRequired]);
const profesionRules = computed(() => [isRequired]);
const areaRules = computed(() => [isRequired]);
const natureRules = computed(() => [isRequired]);
const typeRules = computed(() => [isRequired]);
const salaryRules = computed(() => [isRequired]);
const maxSalaryRules = computed(() => [isRequired]);

function handleSubmit() {

    const isFormValid = form.value.validate()
    if (isFormValid) {
        console.log({
            title: title.value,
            company: company.value,
            profesion: profesion.value,
            area: area.value,
            salary: salary.value,
            maxSalary: maxSalary.value,
            nature: nature.value,
            type: type.value,
            skills: skills.value,
            description: description.value
        });
        // loginUser({ title: title.value, password: password.value });
        form.value.reset()
    }
}
watch(isAuthorized, () => { if (isAuthorized) { router.push({ name: 'home' }) } })
watch(profesion, () => { debounce(() => { getProfesions(profesion.value.name, 10) }, 200) })
watch(area, () => { debounce(() => { getAreas(area.value.name, 10) }, 200) })

getFormParameters();
getProfesions('', 10);
getAreas('', 10);
</script>
  
<style lang="scss" scoped>
// @import "./style.module.scss";
</style>