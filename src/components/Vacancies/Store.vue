<template>
    <MainTitle class="title">{{ titleText }}</MainTitle>

    <v-row>
        <v-col>
            <strong>Company:</strong> {{ company.name }}
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <strong>Profession:</strong> {{ profession.name }}
        </v-col>
    </v-row>
    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">

        <CustomInput v-model="title" autocomplete="title" placeholder="enter title" name="title" :rules="titleRules"
            class="login__input" :label="'title'" />

        <CustomOneSearchSelect v-model="area" class="login__input" :label="'area'" :rules="areaRules" name="area"
            :options="areas" />

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
import CustomManySearchSelect from "../shared/form/CustomManySearchSelect.vue";
import CustomOneSearchSelect from "../shared/form/CustomOneSearchSelect.vue";
import CustomTextArea from "../shared/form/CustomTextArea.vue";
import CustomForm from "../shared/form/CustomForm.vue";
import CustomInput from "../shared/form/CustomInput.vue";
import Button from "../shared/form/Button.vue";
import CustomOneSelect from "../shared/form/CustomOneSelect.vue";
import {
    maxString, minString, isRequired, isRequiredObjName, isNumber
} from "../../utils/validationRules";
import MainTitle from "../shared/MainTitle.vue";
import { useAuthStore } from "../../store/authStore"
import { useFormParametersStore } from '../../store/formParametersStore'
import { useEmploymentStore } from '../../store/employmentStore'
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router";
import { debounce } from "../../utils/debounce";
import { storeVacancy } from "../../store/actions/vacancy"


defineProps({
    titleText: {
        type: String,
        default: "",
    },
})

const router = useRouter()

const title = ref("")
const area = ref({ id: '', name: '' });
const salary = ref("")
const maxSalary = ref("")
const nature = ref("")
const type = ref("")
const description = ref("")
const selectedSkills = ref([]);

const form = ref(null);
const { isAuthorized } = storeToRefs(useAuthStore());
const { getAreas, getFormParameters } = useFormParametersStore();
const { company, vacancy } = storeToRefs(useEmploymentStore());
const { setVacancy } = useEmploymentStore();
const { profession, types, natures, areas, skills } = storeToRefs(useFormParametersStore());

const titleRules = computed(() => [isRequired, maxString(200), minString(1)]);
const descriptionRules = computed(() => [isRequired, maxString(2000), minString(1)]);
const skillsRules = computed(() => [isRequired, maxString(200), minString(1)]);
const areaRules = computed(() => [isRequiredObjName]);
const natureRules = computed(() => [isRequired]);
const typeRules = computed(() => [isRequired]);
const salaryRules = computed(() => [isRequired, isNumber]);
const maxSalaryRules = computed(() => [isNumber]);

async function handleSubmit() {

    const isFormValid = form.value.validate()
    if (isFormValid) {

        await storeVacancy({
            title: title.value,
            profession: profession.value,
            area: area.value,
            salary: salary.value,
            maxSalary: maxSalary.value,
            nature: nature.value,
            type: type.value,
            skills: selectedSkills.value,
            description: description.value
        });


    }
}
watch(vacancy, (newVal) => {
    if (newVal?.id) {
        form.value.reset()

        router.push({
            path: `/vacancies/${newVal?.id}`,
        })
    }
})
// watch(maxSalary, (newVal) => {
//     const val = Number(newVal);
//     console.log(newVal);
//     console.log(isNaN(val));
//     // if (isNaN(val)) {
//     //     maxSalary.value = "";
//     // } else {
//     maxSalary.value = String(val * 1);
//     // }
// })
watch(isAuthorized, () => { if (isAuthorized) { router.push({ name: 'home' }) } })

watch(area, () => { debounce(() => { getAreas(area.value.name, 10) }, 200) })

getFormParameters();
setVacancy({});
getAreas('', 10);
</script>
  
<style lang="scss" scoped>
// @import "./style.module.scss";
</style>