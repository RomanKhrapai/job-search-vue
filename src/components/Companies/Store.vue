<template>
    <MainTitle class="title">{{ titleText }}</MainTitle>
    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">


        <div>
            <label class="custom-label form__input">Image:
                <div id="fileInputshow">
                    <img loading="lazy" :src="fullImageURL" height="320" width="479">
                </div>
                <input @change="handleFile" id="fileInput" type="file" name="img" accept=" image/jpeg"
                    class=" custom-file-input " />
                <input type="hidden" name="image" id="input-image" value="" />
            </label>
        </div>


        <CustomInput v-model="title" autocomplete="title" placeholder="enter name" name="title" :rules="titleRules"
            class="login__input" :label="'name'" />

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
import CustomManySearchSelect from "../shared/form/CustomInput/CustomManySearchSelect.vue";
import CustomOneSearchSelect from "../shared/form/CustomInput/CustomOneSearchSelect.vue";
import CustomTextArea from "../shared/form/CustomInput/CustomTextArea.vue";
import CustomForm from "../shared/form/CustomForm.vue";
import CustomInput from "../shared/form/CustomInput/CustomInput.vue";
import Button from "../shared/form/Button/Button.vue";
import CustomOneSelect from "../shared/form/CustomInput/CustomOneSelect.vue";
import MainTitle from "../shared/MainTitle.vue";

import {
    maxString, minString, isRequired,
} from "../../utils/validationRules";
import { useAuthStore } from "../../store/authStore"
import { useFormParametersStore } from '../../store/formParametersStore'
import { useEmploymentStore } from '../../store/employmentStore'
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router";
import { debounce } from "../../utils/debounce";

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
const { isAuthorized, companies, } = storeToRefs(useAuthStore());
const { getAreas, getProfessions, getFormParameters, getSkills } = useFormParametersStore();

const { storeVacancy, uploadAvatar } = useEmploymentStore();
const { fullImageURL } = storeToRefs(useEmploymentStore());
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

function handleFile(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const formData = new FormData();

        if (files[0].size < 2000000) {
            formData.append("file", files[0]);
        } else {
            this.value = "";
            formData.append("size", 2000000);
        }

        uploadAvatar(formData);
    }
}




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