<template>
    <MainTitle class="title">{{ titleText }}</MainTitle>
    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">
        <CustomInput v-model="title" autocomplete="title" placeholder="enter title" name="title" :rules="titleRules"
            class="login__input" :label="'title'" />

        <CustomOneSelect v-model="company" class="login__input" :label="'company'" :rules="companyRules" name="company"
            :options="companies" />

        <CustomOneSearchSelect v-model="area" class="login__input" :label="'area'" :rules="areaRules" name="area"
            :options="areas" />

        <CustomOneSearchSelect v-model="profession" class="login__input" :label="'profession'" :rules="professionRules"
            name="profession" :options="professions" />

        <CustomInput v-model="salary" autocomplete="salary" placeholder="enter salary" name="salary" :rules="salaryRules"
            class="login__input" :label="'salary'" />

        <CustomInput v-model="maxSalary" autocomplete=" max salary" placeholder="enter max salary" name="maxSalary"
            :rules="maxSalaryRules" class="login__input" :label="'max salary'" />

        <CustomManySearchSelect v-model="selectedSkills" class="login__input" name="skills" :label="'skills'"
            :options="skills" placeholder="select you skill" :rules="skillsRules" />

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
import { useEmploymentStore } from '../../../store/employmentStore'
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
const profession = ref({ id: '', name: '' });
const area = ref({ id: '', name: '' });
const salary = ref("")
const maxSalary = ref("")
const nature = ref("")
const type = ref("")
const description = ref("")
const selectedSkills = ref([]);

const form = ref(null)
const { isAuthorized, companies } = storeToRefs(useAuthStore());
const { getAreas, getProfessions, getFormParameters, getSkills } = useFormParametersStore();
const { storeVacancy } = useEmploymentStore();
const { professions, types, natures, areas, skills } = storeToRefs(useFormParametersStore());

const titleRules = computed(() => [isRequired, maxString(200), minString(3)]);
const descriptionRules = computed(() => [isRequired, maxString(2000), minString(3)]);
const skillsRules = computed(() => [isRequired, maxString(200), minString(3)]);
const companyRules = computed(() => [isRequired]);
const professionRules = computed(() => [isRequired]);
const areaRules = computed(() => [isRequired]);
const natureRules = computed(() => [isRequired]);
const typeRules = computed(() => [isRequired]);
const salaryRules = computed(() => [isRequired]);
const maxSalaryRules = computed(() => [isRequired]);

function handleSubmit() {

    const isFormValid = form.value.validate()
    if (isFormValid) {
        storeVacancy({
            title: title.value,
            company: company.value,
            profession: profession.value,
            area: area.value,
            salary: salary.value,
            maxSalary: maxSalary.value,
            nature: nature.value,
            type: type.value,
            skills: selectedSkills.value,
            description: description.value
        });
        form.value.reset()
    }
}
watch(isAuthorized, () => { if (isAuthorized) { router.push({ name: 'home' }) } })
watch(profession, () => {
    debounce(() => {
        getProfessions(profession.value.name, 10);
        const id = profession.value.id;
        if (id) {
            getSkills(id);
        }
    },
        200)
})
watch(area, () => { debounce(() => { getAreas(area.value.name, 10) }, 200) })

getFormParameters();
getProfessions('', 10);
getAreas('', 10);
</script>
  
<style lang="scss" scoped>
// @import "./style.module.scss";
</style>